import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";
  const date = searchParams.get("date") || "";
  const date_from = searchParams.get("date_from") || "";
  const date_to = searchParams.get("date_to") || "";
  const doctor_id = searchParams.get("doctor_id") || "";
  const department_id = searchParams.get("department_id") || "";

  let query = supabase
    .from("appointments")
    .select("id, patient_name, patient_phone, appointment_date, appointment_time, status, payment_mode, payment_status, amount, source, created_at, doctors!inner(name, departments(name))")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: true })
    .limit(5000);

  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);

  if (date === "today") {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    query = query.eq("appointment_date", today);
  } else if (date) {
    query = query.eq("appointment_date", date);
  }

  if (date_from) query = query.gte("appointment_date", date_from);
  if (date_to) query = query.lte("appointment_date", date_to);
  if (doctor_id) query = query.eq("doctor_id", doctor_id);
  if (department_id) query = query.eq("doctors.department_id", department_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Build CSV
  const headers = ["Patient Name", "Phone", "Doctor", "Department", "Date", "Time", "Status", "Payment Mode", "Payment Status", "Amount (₹)", "Source", "Booked On"];
  
  const rows = (data || []).map(a => [
    `"${(a.patient_name || "").replace(/"/g, '""')}"`,
    a.patient_phone || "",
    `"${(a.doctors?.name || "").replace(/"/g, '""')}"`,
    `"${(a.doctors?.departments?.name || "").replace(/"/g, '""')}"`,
    a.appointment_date || "",
    (a.appointment_time || "").substring(0, 5),
    a.status || "",
    a.payment_mode || "",
    a.payment_status || "",
    a.amount || "",
    a.source || "",
    a.created_at ? new Date(a.created_at).toLocaleDateString("en-IN") : "",
  ]);

  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  // Generate filename
  let filename = "appointments";
  if (date_from && date_to) filename += `_${date_from}_to_${date_to}`;
  else if (date === "today") filename += "_today";
  else if (date) filename += `_${date}`;
  filename += ".csv";

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
