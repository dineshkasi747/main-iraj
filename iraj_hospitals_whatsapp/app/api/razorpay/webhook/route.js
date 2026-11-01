/**
 * POST /api/razorpay/webhook
 * Handles Razorpay payment.captured events.
 * Verifies signature, updates appointment to confirmed + paid.
 */
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { sendPaymentSuccessConfirmation } from "@/lib/whatsapp";

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  // Verify webhook signature
  try {
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event;

  if (event === "payment.captured") {
    const payment = payload.payload.payment.entity;
    const razorpayPaymentId = payment.id;
    const notes = payment.notes || {};
    const appointmentId = notes.appointment_id;

    if (!appointmentId) {
      return NextResponse.json({ error: "No appointment_id in notes" }, { status: 400 });
    }

    // Update appointment to confirmed + paid
    const { data: appt } = await supabase
      .from("appointments")
      .update({
        status: "confirmed",
        payment_status: "paid",
        razorpay_payment_id: razorpayPaymentId,
      })
      .eq("id", appointmentId)
      .select("*, doctors(name)")
      .single();

    // Send WhatsApp confirmation
    if (appt?.patient_phone) {
      try {
        await sendPaymentSuccessConfirmation(appt.patient_phone, {
          patientName: appt.patient_name,
          doctorName: appt.doctors?.name || "our doctor",
          date: appt.appointment_date,
          time: appt.appointment_time,
        });
      } catch (waErr) {
        console.error("[razorpay/webhook] WhatsApp confirm error:", waErr.message);
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
