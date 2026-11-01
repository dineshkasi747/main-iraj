/**
 * Email alerting for WhatsApp API failures, LLM failures, etc.
 * Uses Resend (https://resend.com) — set RESEND_API_KEY in env
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.ALERT_EMAIL_SMTP_CREDENTIALS_OR_RESEND_API_KEY;
const FROM_EMAIL = process.env.ALERT_EMAIL_FROM || "onboarding@resend.dev";

/**
 * Send an alert email
 */
async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not set — skipping email alert");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Email] Failed to send alert:", err);
    }
  } catch (err) {
    console.error("[Email] Error while trying to send email:", err);
  }
}

/**
 * Alert staff when a WhatsApp API call fails
 */
export async function alertWhatsAppFailure({ patientPhone, error, contactPhone, contactEmail }) {
  if (!contactEmail) return;
  await sendEmail({
    to: contactEmail,
    subject: `⚠️ WhatsApp Send Failure — Patient ${patientPhone}`,
    html: `
      <h2>WhatsApp API Send Failure</h2>
      <p>A WhatsApp message could not be delivered to a patient.</p>
      <table>
        <tr><td><strong>Patient Phone:</strong></td><td>${patientPhone}</td></tr>
        <tr><td><strong>Error:</strong></td><td>${error}</td></tr>
        <tr><td><strong>Time:</strong></td><td>${new Date().toISOString()}</td></tr>
      </table>
      <p>Please call the patient directly at <strong>${patientPhone}</strong> or ask reception to follow up.</p>
      <p>Hospital Contact: <strong>${contactPhone}</strong></p>
    `,
  });
}

/**
 * Alert staff when Gemini LLM API fails
 */
export async function alertLLMFailure({ patientPhone, error, contactPhone, contactEmail }) {
  if (!contactEmail) return;
  await sendEmail({
    to: contactEmail,
    subject: `⚠️ AI Bot Failure — Patient ${patientPhone} needs manual follow-up`,
    html: `
      <h2>AI Conversation Bot Failure</h2>
      <p>The Gemini AI bot encountered an error for a patient conversation and could not continue.</p>
      <table>
        <tr><td><strong>Patient Phone:</strong></td><td>${patientPhone}</td></tr>
        <tr><td><strong>Error:</strong></td><td>${error}</td></tr>
        <tr><td><strong>Time:</strong></td><td>${new Date().toISOString()}</td></tr>
      </table>
      <p>Please follow up manually with this patient. Their conversation is now marked as <strong>error</strong> in the dashboard.</p>
      <p>Patient phone: <strong>${patientPhone}</strong></p>
      <p>Hospital number: <strong>${contactPhone}</strong></p>
    `,
  });
}
