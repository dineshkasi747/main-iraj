import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const date_from = searchParams.get("date_from");
  const date_to = searchParams.get("date_to");

  let query = supabase
    .from("appointments")
    .select("id, patient_name, patient_phone, appointment_date, appointment_time, payment_status, payment_mode, amount, razorpay_payment_id, razorpay_order_id, created_at, doctors(name)")
    .eq("payment_mode", "online")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("payment_status", status);
  if (date_from) query = query.gte("appointment_date", date_from);
  if (date_to) query = query.lte("appointment_date", date_to);

  const { data, error } = await query;

  if (error) {
    return new NextResponse("Error fetching payments", { status: 500 });
  }

  if (!data || data.length === 0) {
    return new NextResponse("No online payments found for the selected filters.", { status: 404 });
  }

  // Generate CSV
  const header = [
    "Patient Name",
    "Patient Phone",
    "Doctor Name",
    "Appointment Date",
    "Appointment Time",
    "Amount (INR)",
    "Payment Status",
    "Razorpay Payment ID",
    "Razorpay Order ID",
    "Created At"
  ].join(",");

  const rows = data.map((p) => {
    return [
      `"${p.patient_name || ""}"`,
      `"${p.patient_phone || ""}"`,
      `"${p.doctors?.name || ""}"`,
      `"${p.appointment_date || ""}"`,
      `"${p.appointment_time || ""}"`,
      `"${p.amount || 0}"`,
      `"${p.payment_status || ""}"`,
      `"${p.razorpay_payment_id || ""}"`,
      `"${p.razorpay_order_id || ""}"`,
      `"${p.created_at || ""}"`
    ].join(",");
  });

  const csvContent = [header, ...rows].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="payments_export_${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
