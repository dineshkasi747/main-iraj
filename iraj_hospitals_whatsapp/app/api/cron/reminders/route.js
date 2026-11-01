/**
 * GET /api/cron/reminders
 * Vercel Cron Job — runs ONCE A DAY (Hobby tier limitation)
 * Finds all appointments for today and sends WhatsApp reminders.
 * Skips appointments that have already passed before the cron runs.
 */
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { sendAppointmentReminder } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
  // Verify cron secret if triggered by Vercel
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  // We allow manual triggers (no auth) from the dashboard for testing/manual firing
  // so we won't hard-block it if it's missing the header, unless strictly required.
  if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get current IST time
  const now = new Date();
  const todayIST = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  
  // Get current IST time string (HH:MM) to compare against appointment times
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });
  const timeIST = formatter.format(now); // e.g., "06:30"

  // Fetch appointments for today that haven't received a reminder
  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, patient_name, patient_phone, appointment_date, appointment_time, doctors(name)")
    .eq("status", "confirmed")
    .eq("reminder_sent", false)
    .eq("appointment_date", todayIST);

  if (!appointments || appointments.length === 0) {
    return NextResponse.json({ sent: 0, skipped: 0, message: "No reminders due for today" });
  }

  let sent = 0;
  let skipped = 0;
  const errors = [];

  for (const appt of appointments) {
    // If the appointment time is in the past (e.g., booked for 5 AM, but cron runs at 6 AM)
    if (appt.appointment_time < timeIST) {
      // Mark as sent so we don't try again, but don't actually send a message to avoid confusing the patient
      await supabase.from("appointments").update({ reminder_sent: true }).eq("id", appt.id);
      skipped++;
      continue;
    }

    // Appointment is in the future today, send the reminder!
    try {
      await sendAppointmentReminder(appt.patient_phone, {
        patientName: appt.patient_name,
        doctorName: appt.doctors?.name || "our doctor",
        date: appt.appointment_date,
        time: appt.appointment_time,
      });

      // Mark as sent
      await supabase.from("appointments").update({ reminder_sent: true }).eq("id", appt.id);
      sent++;
    } catch (err) {
      errors.push({ id: appt.id, phone: appt.patient_phone, error: err.message });
      await supabase.from("error_logs").insert({
        type: "whatsapp_api_failure",
        patient_phone: appt.patient_phone,
        details: `Reminder send failed: ${err.message}`,
      });
    }
  }

  return NextResponse.json({
    sent,
    skipped,
    errors: errors.length,
    message: `Daily Reminders processed: ${sent} sent, ${skipped} skipped (already passed), ${errors.length} errors`,
  });
}
