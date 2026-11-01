/**
 * WhatsApp Cloud API helpers
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 */

const WA_TOKEN = process.env.WHATSAPP_TOKEN;
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WA_API_BASE = `https://graph.facebook.com/v18.0/${WA_PHONE_ID}/messages`;

/**
 * Send a plain text message to a WhatsApp number
 */
export async function sendTextMessage(to, text) {
  const res = await fetch(WA_API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`WhatsApp API error: ${res.status} — ${JSON.stringify(err)}`);
  }

  return res.json();
}

/**
 * Send a template message (e.g., welcome / reminder)
 */
export async function sendTemplateMessage(to, templateName, langCode = "en") {
  const res = await fetch(WA_API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: langCode },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`WhatsApp template error: ${res.status} — ${JSON.stringify(err)}`);
  }

  return res.json();
}

/**
 * Send appointment confirmation message
 */
export async function sendAppointmentConfirmation(to, { patientName, doctorName, date, time }) {
  const text =
    `✅ *Appointment Confirmed!*\n\n` +
    `Hello ${patientName}, your appointment at IRAJ Multi-Speciality Hospital, Gajuwaka has been confirmed.\n\n` +
    `👨‍⚕️ *Doctor:* ${doctorName}\n` +
    `📅 *Date:* ${date}\n` +
    `🕐 *Time:* ${time}\n\n` +
    `Would you like to pay your consultation fee securely online now, or pay at the hospital reception when you arrive?\n\n` +
    `_Reply with *Online* or *At Hospital*._`;

  return sendTextMessage(to, text);
}

/**
 * Send payment success confirmation (after Razorpay webhook)
 */
export async function sendPaymentSuccessConfirmation(to, { patientName, doctorName, date, time }) {
  const text =
    `🎉 *Payment Successful!*\n\n` +
    `Hello ${patientName}, we have received your online payment. Your appointment is now fully confirmed!\n\n` +
    `👨‍⚕️ *Doctor:* ${doctorName}\n` +
    `📅 *Date:* ${date}\n` +
    `🕐 *Time:* ${time}\n\n` +
    `📍 IRAJ Multi-Speciality Hospital, Gajuwaka\n\n` +
    `_Thank you! We look forward to seeing you._ 🏥`;

  return sendTextMessage(to, text);
}

/**
 * Send appointment reminder (1 hour before)
 */
export async function sendAppointmentReminder(to, { patientName, doctorName, date, time }) {
  const text =
    `⏰ *Appointment Reminder*\n\n` +
    `Hello ${patientName}! Your appointment is in *1 hour*.\n\n` +
    `👨‍⚕️ *Doctor:* ${doctorName}\n` +
    `📅 *Date:* ${date}\n` +
    `🕐 *Time:* ${time}\n\n` +
    `📍 IRAJ Multi-Speciality Hospital, Gajuwaka\n\n` +
    `_Please ensure you carry any previous reports. See you soon!_ 🏥`;

  return sendTextMessage(to, text);
}

/**
 * Send Razorpay payment link
 */
export async function sendPaymentLink(to, { patientName, amount, paymentLink }) {
  const text =
    `💳 *Complete Your Appointment Payment*\n\n` +
    `Hello ${patientName}, please complete your consultation fee payment to confirm your appointment.\n\n` +
    `💰 *Amount:* ₹${amount}\n\n` +
    `🔗 *Pay here:* ${paymentLink}\n\n` +
    `_Payment link expires in 24 hours. Your appointment will be confirmed upon payment._`;

  return sendTextMessage(to, text);
}

/**
 * Send interactive buttons (max 3 buttons)
 */
export async function sendInteractiveButtons(to, text, buttons) {
  const res = await fetch(WA_API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text },
        action: {
          buttons: buttons.slice(0, 3).map((btn, index) => ({
            type: "reply",
            reply: { id: `btn_${index}`, title: btn.substring(0, 20) },
          })),
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`WhatsApp Interactive Buttons error: ${res.status} — ${JSON.stringify(err)}`);
  }
  return res.json();
}

/**
 * Send interactive CTA URL button (1 button with a link)
 */
export async function sendCtaUrlButton(to, text, buttonText, url) {
  const res = await fetch(WA_API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "interactive",
      interactive: {
        type: "cta_url",
        body: { text },
        action: {
          name: "cta_url",
          parameters: {
            display_text: buttonText.substring(0, 20),
            url: url
          }
        }
      }
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`WhatsApp CTA URL error: ${res.status} — ${JSON.stringify(err)}`);
  }
  return res.json();
}

/**
 * Send interactive list (up to 10 options)
 */
export async function sendInteractiveList(to, text, buttonText, options) {
  const res = await fetch(WA_API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        body: { text },
        action: {
          button: buttonText.substring(0, 20),
          sections: [
            {
              title: "Available Options",
              rows: options.slice(0, 10).map((opt, i) => ({
                id: `opt_${i}`,
                title: opt.substring(0, 24),
                description: opt.length > 24 ? opt.substring(0, 72) : undefined,
              })),
            },
          ],
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`WhatsApp Interactive List error: ${res.status} — ${JSON.stringify(err)}`);
  }
  return res.json();
}
