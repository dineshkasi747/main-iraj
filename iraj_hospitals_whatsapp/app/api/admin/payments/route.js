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
    .order("created_at", { ascending: false })
    .limit(500);

  if (status) query = query.eq("payment_status", status);
  if (date_from) query = query.gte("appointment_date", date_from);
  if (date_to) query = query.lte("appointment_date", date_to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ payments: data || [] });
}
