import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { id, payment_status, payment_mode, razorpay_payment_id } = await req.json();

    if (!id || !payment_status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updates = { payment_status };
    if (payment_mode) updates.payment_mode = payment_mode;
    if (razorpay_payment_id) updates.razorpay_payment_id = razorpay_payment_id;

    const { data, error } = await supabase
      .from("appointments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
