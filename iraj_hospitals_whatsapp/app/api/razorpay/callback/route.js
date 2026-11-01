import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  
  // Razorpay Payment Link callback parameters
  const status = searchParams.get("razorpay_payment_link_status");

  // Fetch hospital WhatsApp number from settings
  const { data: settings } = await supabase.from("settings").select("hospital_contact_phone").single();
  const rawPhone = settings?.hospital_contact_phone || "919801081080";
  const hospitalPhone = rawPhone.replace(/\D/g, ""); // clean non-digits

  if (status === "paid") {
    // Redirect to WhatsApp with a success message so they return to the bot
    const waUrl = `https://wa.me/${hospitalPhone}?text=Payment%20completed!`;
    return NextResponse.redirect(waUrl);
  } else {
    // Redirect to WhatsApp with a failure/cancel message
    const waUrl = `https://wa.me/${hospitalPhone}?text=Payment%20failed%20or%20cancelled.`;
    return NextResponse.redirect(waUrl);
  }
}
