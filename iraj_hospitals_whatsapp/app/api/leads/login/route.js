/**
 * POST /api/leads/login
 * Called by the hospital website when a patient logs in / registers.
 * Saves to users table, then sends a WhatsApp welcome template message.
 */
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { sendTemplateMessage, sendTextMessage } from "@/lib/whatsapp";
import { alertWhatsAppFailure } from "@/lib/email";

function authOk(req) {
  const key = req.headers.get("x-api-key");
  return key && key === process.env.HOSPITAL_WEBSITE_API_KEY;
}

export async function POST(req) {
  if (!authOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { phone_number, name } = body;
  if (!phone_number) {
    return NextResponse.json({ error: "phone_number is required" }, { status: 400 });
  }

  // Normalize phone: ensure +91 prefix
  const cleanPhone = phone_number.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("91") ? `+${cleanPhone}` : `+91${cleanPhone}`;

  // 1. Upsert user record
  try {
    await supabase.from("users").upsert(
      { phone_number: formattedPhone, name: name || null },
      { onConflict: "phone_number" }
    );
  } catch (err) {
    console.error("[leads/login] Supabase upsert error:", err.message);
  }

  // 2. Fetch settings for template name
  const { data: settings } = await supabase
    .from("settings")
    .select("welcome_message_template_name, hospital_contact_email, hospital_contact_phone")
    .single();

  const templateName = settings?.welcome_message_template_name || "hello_world";

  // 3. Send WhatsApp welcome message
  try {
    await sendTemplateMessage(formattedPhone, templateName);
  } catch (waErr) {
    console.error("[leads/login] WhatsApp send error:", waErr.message);

    // Log failure to error_logs
    await supabase.from("error_logs").insert({
      type: "whatsapp_api_failure",
      patient_phone: formattedPhone,
      details: `Welcome template send failed: ${waErr.message}`,
    });

    // Alert staff via email
    await alertWhatsAppFailure({
      patientPhone: formattedPhone,
      error: waErr.message,
      contactEmail: settings?.hospital_contact_email,
      contactPhone: settings?.hospital_contact_phone,
    });

    // Still return 200 — login itself succeeded
    return NextResponse.json({
      success: true,
      warning: "User saved but WhatsApp welcome message failed",
    });
  }

  return NextResponse.json({ success: true, message: "Welcome message sent" });
}
