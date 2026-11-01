/**
 * POST /api/leads/appointment-form
 * Called by the hospital website when a patient submits the full appointment form.
 * Creates a CONFIRMED appointment directly (source=website_lead).
 * Sends WhatsApp confirmation to the patient.
 */
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { sendAppointmentConfirmation } from "@/lib/whatsapp";
import { alertWhatsAppFailure } from "@/lib/email";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function authOk(req) {
  const key = req.headers.get("x-api-key");
  return key && key === process.env.HOSPITAL_WEBSITE_API_KEY;
}

export async function POST(req) {
  if (!authOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: corsHeaders });
  }

  const { name, phone, department, doctor_name, appointment_date, appointment_time, notes } = body;

  if (!name || !phone || !doctor_name || !appointment_date || !appointment_time) {
    return NextResponse.json(
      { error: "Missing required fields: name, phone, doctor_name, appointment_date, appointment_time" },
      { status: 400, headers: corsHeaders }
    );
  }

  // Normalize phone
  const cleanPhone = phone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("91") ? `+${cleanPhone}` : `+91${cleanPhone}`;

  // Normalize time: accept "10:00 AM" or "10:00" → DB needs "HH:MM"
  let dbTime = appointment_time;
  const timeMatch = appointment_time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (timeMatch) {
    let h = parseInt(timeMatch[1]);
    const m = timeMatch[2];
    const period = timeMatch[3]?.toUpperCase();
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    dbTime = `${String(h).padStart(2, "0")}:${m}`;
  }

  // Look up doctor by name
  const { data: doctor, error: docErr } = await supabase
    .from("doctors")
    .select("id, name, specialization")
    .ilike("name", doctor_name)
    .eq("is_active", true)
    .single();

  if (docErr || !doctor) {
    return NextResponse.json(
      { error: `Doctor not found: ${doctor_name}` },
      { status: 422, headers: corsHeaders }
    );
  }

  // Fetch settings for default fee
  const { data: settings } = await supabase
    .from("settings")
    .select("default_appointment_fee, hospital_contact_email, hospital_contact_phone")
    .single();

  // Insert appointment — UNIQUE(doctor_id, date, time) is the concurrency guard
  const { data: appt, error: insertErr } = await supabase
    .from("appointments")
    .insert({
      doctor_id: doctor.id,
      patient_name: name,
      patient_phone: formattedPhone,
      appointment_date,
      appointment_time: dbTime,
      status: "confirmed",
      payment_mode: "pay_at_hospital",
      payment_status: "pending",
      amount: settings?.default_appointment_fee || 300,
      source: "website_lead",
    })
    .select()
    .single();

  if (insertErr) {
    if (insertErr.code === "23505") {
      // UNIQUE violation — slot already taken
      return NextResponse.json(
        {
          error: "slot_taken",
          message: `The slot at ${appointment_time} on ${appointment_date} with ${doctor_name} is already booked. Please choose another slot.`,
        },
        { status: 409, headers: corsHeaders }
      );
    }
    console.error("[appointment-form] Insert error:", insertErr);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500, headers: corsHeaders });
  }

  // Log lead record (audit trail)
  await supabase.from("leads").insert({
    patient_name: name,
    patient_phone: formattedPhone,
    source: "website_appointment_form",
    linked_appointment_id: appt.id,
  });

  // Fetch existing conversation to preserve message_history
  const { data: existingConv } = await supabase
    .from("conversations")
    .select("message_history, known_facts")
    .eq("patient_phone", formattedPhone)
    .single();

  const mergedFacts = {
    ...(existingConv?.known_facts || {}),
    name,
    phone: formattedPhone,
    last_department: department || null,
    last_doctor: doctor.name,
    pending_appointment_id: appt.id,
  };

  const newHistory = [
    ...(existingConv?.message_history || []),
    {
      role: "assistant",
      content: `✅ Appointment Confirmed!\n\nHello ${name}, your appointment with ${doctor.name} on ${appointment_date} at ${appointment_time} is confirmed.\n\nWould you like to pay your consultation fee securely online now, or pay at the hospital reception when you arrive? [OPTIONS: Online, At Hospital]`,
      timestamp: new Date().toISOString()
    }
  ];

  if (existingConv) {
    await supabase.from("conversations").update({
      known_facts: mergedFacts,
      message_history: newHistory,
      status: "active",
      updated_at: new Date().toISOString(),
    }).eq("patient_phone", formattedPhone);
  } else {
    await supabase.from("conversations").insert({
      patient_phone: formattedPhone,
      known_facts: mergedFacts,
      message_history: newHistory,
      status: "active",
      updated_at: new Date().toISOString(),
    });
  }

  // Send WhatsApp confirmation
  try {
    await sendAppointmentConfirmation(formattedPhone, {
      patientName: name,
      doctorName: doctor.name,
      date: appointment_date,
      time: appointment_time,
    });
  } catch (waErr) {
    console.error("[appointment-form] WhatsApp confirmation error:", waErr.message);

    await supabase.from("error_logs").insert({
      type: "whatsapp_api_failure",
      patient_phone: formattedPhone,
      details: `Appointment confirmation send failed: ${waErr.message}`,
    });

    await alertWhatsAppFailure({
      patientPhone: formattedPhone,
      error: waErr.message,
      contactEmail: settings?.hospital_contact_email,
      contactPhone: settings?.hospital_contact_phone,
    });

    // Appointment was still created successfully
    return NextResponse.json({
      success: true,
      appointment_id: appt.id,
      warning: "Appointment created but WhatsApp confirmation failed",
    }, { headers: corsHeaders });
  }

  return NextResponse.json({
    success: true,
    appointment_id: appt.id,
    message: "Appointment confirmed and WhatsApp message sent",
  }, { headers: corsHeaders });
}
