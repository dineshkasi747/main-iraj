import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "0");
  const limit = parseInt(searchParams.get("limit") || "25");
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";
  const date = searchParams.get("date") || "";
  const date_from = searchParams.get("date_from") || "";
  const date_to = searchParams.get("date_to") || "";
  const doctor_id = searchParams.get("doctor_id") || "";
  const department_id = searchParams.get("department_id") || "";

  let query = supabase
    .from("appointments")
    .select("id, patient_name, patient_phone, appointment_date, appointment_time, status, payment_mode, payment_status, amount, source, created_at, doctors(id, name, department_id, departments(name))")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: true })
    .range(page * limit, (page + 1) * limit - 1);

  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  
  if (date === "today") {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    query = query.eq("appointment_date", today);
  } else if (date) {
    query = query.eq("appointment_date", date);
  }

  // Date-range filters
  if (date_from) query = query.gte("appointment_date", date_from);
  if (date_to) query = query.lte("appointment_date", date_to);

  if (doctor_id) query = query.eq("doctor_id", doctor_id);
  if (department_id) query = query.eq("doctors.department_id", department_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ appointments: data || [], total: (data || []).length });
}

export async function POST(req) {
  const body = await req.json();
  const { doctor_id, patient_name, patient_phone, appointment_date, appointment_time, payment_mode, amount } = body;

  if (!doctor_id || !patient_name || !patient_phone || !appointment_date || !appointment_time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase.from("appointments").insert({
    doctor_id,
    patient_name,
    patient_phone,
    appointment_date,
    appointment_time,
    status: "confirmed",
    payment_mode: payment_mode || "pay_at_hospital",
    payment_status: payment_mode === "online" ? "pending" : "not_required",
    amount: amount || 300,
    source: "offline",
    reminder_sent: false
  }).select().single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: "That time slot is already booked for this doctor." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, appointment: data });
}
