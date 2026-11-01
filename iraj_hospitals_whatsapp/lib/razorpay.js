/**
 * Razorpay payment integration helpers
 */

const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "dummy_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

/**
 * Create a Razorpay order for appointment payment
 */
export async function createPaymentOrder({ amount, appointmentId, patientName, patientPhone }) {
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: "INR",
    receipt: `appt_${appointmentId}`.substring(0, 40),
    notes: {
      appointment_id: appointmentId,
      patient_name: patientName,
      patient_phone: patientPhone,
    },
  });

  return order;
}

/**
 * Verify Razorpay webhook signature
 * @param {string} body - Raw request body as string
 * @param {string} signature - x-razorpay-signature header
 */
export function verifyWebhookSignature(body, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("RAZORPAY_WEBHOOK_SECRET not configured");

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body);
  const digest = hmac.digest("hex");

  return digest === signature;
}

/**
 * Generate a Razorpay payment link URL for WhatsApp
 * (Short link using Razorpay Payment Links API)
 */
export async function createPaymentLink({ amount, appointmentId, patientName, patientPhone, patientEmail }) {
  const link = await razorpay.paymentLink.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    accept_partial: false,
    description: `Consultation fee – IRAJ Hospitals (Appt: ${appointmentId})`,
    customer: {
      name: patientName,
      contact: patientPhone,
      email: patientEmail || undefined,
    },
    notify: {
      sms: true,
      email: !!patientEmail,
      whatsapp: false, // We send via our own WhatsApp
    },
    reminder_enable: true,
    notes: { appointment_id: appointmentId },
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/razorpay/callback`,
    callback_method: "get",
  });

  return link.short_url || link.id;
}
