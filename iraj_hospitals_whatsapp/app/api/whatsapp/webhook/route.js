/**
 * GET  /api/webhook  — Meta webhook verification challenge
 * POST /api/webhook  — WhatsApp incoming messages (ack 200 instantly, process async)
 */
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import {
  sendTextMessage,
  sendTemplateMessage,
  sendInteractiveButtons,
  sendInteractiveList,
  sendCtaUrlButton,
} from "@/lib/whatsapp";
import { buildSystemPrompt, runConversationTurn } from "@/lib/gemini";
import { createPaymentLink } from "@/lib/razorpay";
import { alertWhatsAppFailure, alertLLMFailure } from "@/lib/email";

// ─── GET: Meta Webhook Verification ────────────────────────
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// ─── POST: Incoming WhatsApp Messages ──────────────────────
export async function POST(req) {
  // Ack Meta immediately
  const body = await req.json();

  // Process asynchronously — don't await
  processWebhook(body).catch((err) =>
    console.error("[webhook] Background processing error:", err)
  );

  return NextResponse.json({ status: "ok" }, { status: 200 });
}

async function processWebhook(body) {
  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) return;

    const msg = messages[0];
    const from = msg.from; // patient's WhatsApp number e.g. "919801081080"
    const patientPhone = `+${from}`;
    const messageText = msg.text?.body || msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || "";

    if (!messageText) return;

    // Fetch or create conversation
    let { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .eq("patient_phone", patientPhone)
      .single();

    if (!conv) {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert({
          patient_phone: patientPhone,
          message_history: [],
          current_state: "greeting",
          known_facts: {},
          status: "active",
        })
        .select()
        .single();
      conv = newConv;
    }

    // Check if conversation is in error/waiting_onboarding — if so, just log
    if (conv.status === "error" || conv.status === "waiting_onboarding") {
      // Still respond to let the patient know
      await sendTextMessage(
        patientPhone,
        "Hi! Our team is aware of your earlier request and will follow up with you shortly. For urgent help, please call us at +91 98010 81080."
      );
      return;
    }

    // Check known_facts for name/phone (returning patient)
    const knownFacts = conv.known_facts || {};

    // Also check users table and leads for known patient info
    if (!knownFacts.name || !knownFacts.phone) {
      const { data: user } = await supabase
        .from("users")
        .select("name")
        .eq("phone_number", patientPhone)
        .single();
      if (user?.name && !knownFacts.name) knownFacts.name = user.name;
      if (!knownFacts.phone) knownFacts.phone = patientPhone;
    }

    // Fetch hospital context for AI system prompt
    const { data: contextRow } = await supabase
      .from("hospital_context")
      .select("content")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    // Fetch all departments + doctors for AI context
    const { data: departments } = await supabase
      .from("departments")
      .select("id, name, doctors(id, name, specialization, is_active)")
      .eq("doctors.is_active", true);

    const history = conv.message_history || [];


    // Append user message to history
    history.push({ role: "user", content: messageText, timestamp: new Date().toISOString() });

    // Build system prompt
    const systemPrompt = buildSystemPrompt(
      contextRow?.content || "",
      knownFacts,
      departments || []
    );

    // Fetch settings
    const { data: settings } = await supabase.from("settings").select("*").single();

    // ── Function handler for Gemini tool calls ──────────────
    async function functionHandler(name, args) {
      if (name === "check_availability") {
        return await checkAvailability(args, settings);
      }
      if (name === "book_appointment") {
        return await bookAppointment({ ...args, patientPhone }, settings, patientPhone);
      }
      if (name === "set_payment_mode") {
        return await setPaymentMode(args, patientPhone, settings);
      }
      return `Unknown function: ${name}`;
    }

    // Run Gemini conversation
    let aiResponse;
    try {
      // Trim history to last 20 messages for context window
      const recentHistory = history.slice(-20);
      aiResponse = await runConversationTurn(
        systemPrompt,
        recentHistory.slice(0, -1), // exclude current message (sent separately)
        messageText,
        functionHandler
      );
    } catch (llmErr) {
      console.error("[webhook] Gemini error:", llmErr.message);

      // Log and alert
      await supabase.from("error_logs").insert({
        type: "llm_api_failure",
        patient_phone: patientPhone,
        details: llmErr.message,
      });

      await alertLLMFailure({
        patientPhone,
        error: llmErr.message,
        contactEmail: settings?.hospital_contact_email,
        contactPhone: settings?.hospital_contact_phone,
      });

      // We no longer mark conversation as "error" so the user can try again immediately.
      // The error is still logged in `error_logs` for admins to see.

      await sendTextMessage(
        patientPhone,
        "I'm sorry, I'm having technical difficulties right now. Please call us at +91 98010 81080 or visit us directly at Gajuwaka. Our team will assist you. 🙏"
      );
      return;
    }

    // Send reply to patient
    try {
      const optionsMatch = aiResponse.match(/\[OPTIONS:\s*(.+?)\]/);
      let options = [];
      if (optionsMatch) {
        options = optionsMatch[1].split(",").map(o => o.trim()).filter(Boolean);
        aiResponse = aiResponse.replace(optionsMatch[0], "").trim();
      }

      if (options.length > 0) {
        if (options.length <= 3) {
          await sendInteractiveButtons(patientPhone, aiResponse, options);
        } else {
          await sendInteractiveList(patientPhone, aiResponse, "Select Option", options);
        }
      } else if (aiResponse.includes("https://rzp.io/")) {
        // Extract the Razorpay URL
        const urlMatch = aiResponse.match(/(https:\/\/rzp\.io\/\S+)/);
        if (urlMatch) {
          const url = urlMatch[1];
          // Remove the raw URL from the message text to make it look clean
          const cleanText = aiResponse.replace(url, "").trim();
          await sendCtaUrlButton(patientPhone, cleanText || "Please complete your payment securely.", "Pay ₹300 Now", url);
        } else {
          await sendTextMessage(patientPhone, aiResponse);
        }
      } else {
        await sendTextMessage(patientPhone, aiResponse);
      }
    } catch (waErr) {
      console.error("[webhook] WhatsApp reply send error:", waErr.message);

      await supabase.from("error_logs").insert({
        type: "whatsapp_api_failure",
        patient_phone: patientPhone,
        details: `Failed to send AI reply: ${waErr.message}`,
      });

      await alertWhatsAppFailure({
        patientPhone,
        error: waErr.message,
        contactEmail: settings?.hospital_contact_email,
        contactPhone: settings?.hospital_contact_phone,
      });
    }

    // Save updated history + known_facts
    history.push({ role: "assistant", content: aiResponse, timestamp: new Date().toISOString() });

    await supabase
      .from("conversations")
      .update({
        message_history: history.slice(-50), // keep last 50 messages
        known_facts: knownFacts,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("patient_phone", patientPhone);
  } catch (err) {
    console.error("[webhook] Unhandled error:", err);
  }
}

// ─── Function implementations ───────────────────────────────

async function checkAvailability({ doctor_name, date, department }, settings) {
  try {
    // Find doctor
    const { data: doctor } = await supabase
      .from("doctors")
      .select("id, name, doctor_schedules(*)")
      .ilike("name", doctor_name)
      .eq("is_active", true)
      .single();

    if (!doctor) return `Sorry, I couldn't find a doctor named "${doctor_name}". Please check the name.`;

    // Check date is not Sunday
    const d = new Date(date);
    if (d.getDay() === 0) return `Dr. ${doctor.name} is not available on Sundays. Please choose Mon–Sat.`;

    // Get day's schedules
    const dayOfWeek = d.getDay();
    const schedules = (doctor.doctor_schedules || []).filter(
      (s) => s.day_of_week === dayOfWeek && s.is_active
    );

    if (!schedules.length) return `Dr. ${doctor.name} does not have clinic on that day. Please check schedule.`;

    // Generate all slots for the day
    const allSlots = [];
    for (const sched of schedules) {
      const [sh, sm] = sched.start_time.split(":").map(Number);
      const [eh, em] = sched.end_time.split(":").map(Number);
      let t = sh * 60 + sm;
      const end = eh * 60 + em;
      while (t < end) {
        const hh = String(Math.floor(t / 60)).padStart(2, "0");
        const mm = String(t % 60).padStart(2, "0");
        allSlots.push(`${hh}:${mm}`);
        t += sched.slot_duration_minutes || 20;
      }
    }

    // Remove already booked slots
    const { data: booked } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("doctor_id", doctor.id)
      .eq("appointment_date", date)
      .not("status", "eq", "cancelled");

    const bookedTimes = new Set((booked || []).map((b) => b.appointment_time.substring(0, 5)));

    // For today, remove past times
    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const yyyy = nowIST.getFullYear();
    const mm = String(nowIST.getMonth() + 1).padStart(2, "0");
    const dd = String(nowIST.getDate()).padStart(2, "0");
    const todayIST = `${yyyy}-${mm}-${dd}`;
    
    const currentMinutes = date === todayIST ? nowIST.getHours() * 60 + nowIST.getMinutes() : 0;

    const available = allSlots.filter((slot) => {
      if (bookedTimes.has(slot)) return false;
      const [h, m] = slot.split(":").map(Number);
      if (date === todayIST && h * 60 + m <= currentMinutes) return false;
      return true;
    });

    if (!available.length)
      return `No available slots for Dr. ${doctor.name} on ${date}. Please try another date.`;

    // Format nicely
    const formatted = available.map((slot) => {
      const [h, m] = slot.split(":").map(Number);
      const suffix = h < 12 ? "AM" : "PM";
      const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${displayH}:${String(m).padStart(2, "0")} ${suffix}`;
    });

    const bookingWindow = settings?.booking_window_days || 7;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + bookingWindow);
    if (d > maxDate) return `Booking is only available up to ${bookingWindow} days in advance.`;

    return `Available slots for Dr. ${doctor.name} on ${date}:\n${formatted.join(", ")}`;
  } catch (err) {
    return `Error checking availability: ${err.message}`;
  }
}

async function bookAppointment({ doctor_name, date, time, patient_name, patient_phone, department }, settings, whatsappPhone) {
  try {
    const { data: doctor } = await supabase
      .from("doctors")
      .select("id, name")
      .ilike("name", doctor_name)
      .eq("is_active", true)
      .single();

    if (!doctor) return `Doctor "${doctor_name}" not found.`;

    // Normalize time string HH:MM
    const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    let dbTime = time;
    if (timeMatch) {
      let h = parseInt(timeMatch[1]);
      const m = timeMatch[2];
      const period = timeMatch[3]?.toUpperCase();
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      dbTime = `${String(h).padStart(2, "0")}:${m}`;
    }

    const { data: appt, error } = await supabase
      .from("appointments")
      .insert({
        doctor_id: doctor.id,
        patient_name,
        patient_phone: patient_phone || whatsappPhone,
        appointment_date: date,
        appointment_time: dbTime,
        status: "pending_payment",
        payment_mode: "pay_at_hospital",
        payment_status: "pending",
        amount: settings?.default_appointment_fee || 300,
        source: "whatsapp",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return `That slot at ${time} on ${date} with Dr. ${doctor.name} was just taken by another patient. Let me show you other available times.`;
      }
      return `Booking failed: ${error.message}`;
    }

    return JSON.stringify({
      appointment_id: appt.id,
      doctor_name: doctor.name,
      date,
      time,
      patient_name,
      amount: settings?.default_appointment_fee || 300,
      message: "Appointment slot reserved successfully.",
    });
  } catch (err) {
    return `Error booking: ${err.message}`;
  }
}

async function setPaymentMode({ appointment_id, mode }, patientPhone, settings) {
  try {
    if (mode === "pay_at_hospital") {
      await supabase
        .from("appointments")
        .update({ status: "confirmed", payment_mode: "pay_at_hospital", payment_status: "pending" })
        .eq("id", appointment_id);

      return "Appointment confirmed! Payment to be made at the hospital reception. Thank you!";
    }

    if (mode === "online") {
      // Get appointment details for payment link
      const { data: appt } = await supabase
        .from("appointments")
        .select("*, doctors(name)")
        .eq("id", appointment_id)
        .single();

      await supabase
        .from("appointments")
        .update({ payment_mode: "online", status: "pending_payment" })
        .eq("id", appointment_id);

      // Create Razorpay payment link
      let paymentUrl = "#";
      try {
        paymentUrl = await createPaymentLink({
          amount: appt?.amount || 300,
          appointmentId: appointment_id,
          patientName: appt?.patient_name,
          patientPhone: patientPhone,
        });

        // Save order reference
        await supabase
          .from("appointments")
          .update({ razorpay_order_id: paymentUrl })
          .eq("id", appointment_id);
      } catch (rzErr) {
        console.error("[setPaymentMode] Razorpay error:", rzErr.message);
        return `Unable to generate payment link right now. Please pay ₹${appt?.amount || 300} at the hospital. We apologize for the inconvenience.`;
      }

      return JSON.stringify({
        payment_link: paymentUrl,
        amount: appt?.amount || 300,
        message: "Payment link generated. Please complete payment to confirm appointment.",
      });
    }

    return "Unknown payment mode.";
  } catch (err) {
    return `Error setting payment: ${err.message}`;
  }
}
