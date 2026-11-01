import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";
// Assume sendWhatsAppTemplate is a generic way, but we can also just use a raw message for now
// Or we can add a new function in whatsapp.js for custom reminders.
// Let's use sendCustomMessage if it exists, or just do raw fetch.

export async function POST(req) {
  try {
    const { appointmentIds, messageType } = await req.json();

    if (!appointmentIds || !appointmentIds.length) {
      return NextResponse.json({ error: "No appointment IDs provided" }, { status: 400 });
    }

    // Fetch the appointments
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("id, patient_phone, patient_name, appointment_time")
      .in("id", appointmentIds);

    if (error) throw error;

    let successful = [];
    let failed = [];

    for (const appt of appointments) {
      const messageText = `Hello ${appt.patient_name}, this is a reminder from IRAJ Hospitals. Your appointment today is at ${appt.appointment_time}. Please try to arrive at least 10 minutes early to complete any necessary paperwork. We look forward to seeing you!`;
      
      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: appt.patient_phone.replace("+", ""),
        type: "text",
        text: { body: messageText },
      };

      try {
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (res.ok) {
          successful.push({ name: appt.patient_name, phone: appt.patient_phone });
        } else {
          const errData = await res.json();
          failed.push({ name: appt.patient_name, phone: appt.patient_phone, error: errData.error?.message || "WhatsApp API Error" });
        }
      } catch (err) {
        failed.push({ name: appt.patient_name, phone: appt.patient_phone, error: err.message });
      }
    }

    return NextResponse.json({ success: true, successful, failed });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
