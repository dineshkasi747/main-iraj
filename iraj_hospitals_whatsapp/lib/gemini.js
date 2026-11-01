/**
 * Gemini API — Conversation engine with function calling
 * Model: gemini-2.5-flash
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── Function declarations for the AI ──────────────────────
const tools = [
  {
    functionDeclarations: [
      {
        name: "check_availability",
        description:
          "Check available appointment slots for a doctor on a specific date. Returns a list of available time slots.",
        parameters: {
          type: "OBJECT",
          properties: {
            department: { type: "STRING", description: "Department name e.g. 'Cardiology'" },
            doctor_name: { type: "STRING", description: "Doctor's full name e.g. 'Dr. Davala Vasu Babu'" },
            date: { type: "STRING", description: "Date in YYYY-MM-DD format" },
          },
          required: ["doctor_name", "date"],
        },
      },
      {
        name: "book_appointment",
        description:
          "Book an appointment slot for a patient. Returns the appointment ID on success.",
        parameters: {
          type: "OBJECT",
          properties: {
            doctor_name: { type: "STRING" },
            date: { type: "STRING", description: "YYYY-MM-DD" },
            time: { type: "STRING", description: "HH:MM (24-hour)" },
            patient_name: { type: "STRING" },
            patient_phone: { type: "STRING" },
            department: { type: "STRING" },
          },
          required: ["doctor_name", "date", "time", "patient_name", "patient_phone"],
        },
      },
      {
        name: "set_payment_mode",
        description: "Record the patient's chosen payment mode. Call this IMMEDIATELY if the user says 'Online' or 'At Hospital'.",
        parameters: {
          type: "OBJECT",
          properties: {
            appointment_id: { type: "STRING", description: "The pending_appointment_id from known facts" },
            mode: {
              type: "STRING",
              enum: ["online", "pay_at_hospital"],
              description: "Pass 'online' if user chose Online. Pass 'pay_at_hospital' if user chose At Hospital.",
            },
          },
          required: ["appointment_id", "mode"],
        },
      },
    ],
  },
];

/**
 * Build system prompt from hospital context + known patient facts
 */
export function buildSystemPrompt(hospitalContext, knownFacts = {}, departmentsData = []) {
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const getISTDateStr = (offsetDays = 0) => {
    const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    d.setDate(d.getDate() + offsetDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const next3Days = [getISTDateStr(0), getISTDateStr(1), getISTDateStr(2)].join(", ");

  let factSummary = "";
  if (knownFacts.name) factSummary += `\n- Patient name: ${knownFacts.name}`;
  if (knownFacts.phone) factSummary += `\n- WhatsApp: ${knownFacts.phone}`;
  if (knownFacts.last_department) factSummary += `\n- Last department interest: ${knownFacts.last_department}`;
  if (knownFacts.last_doctor) factSummary += `\n- Last doctor consulted: ${knownFacts.last_doctor}`;
  if (knownFacts.pending_appointment_id) factSummary += `\n- Pending Appointment ID (for payment): ${knownFacts.pending_appointment_id}`;

  const deptList = departmentsData.map(
    (d) => `• ${d.name}: ${d.doctors.map((doc) => doc.name).join(", ")}`
  ).join("\n");

  return `You are the WhatsApp appointment assistant for IRAJ Multi-Speciality Hospital, Gajuwaka, Visakhapatnam. Your job is to help patients book appointments efficiently and answer questions about the hospital.

Current IST date/time: ${now}

HOSPITAL INFORMATION:
${hospitalContext}

AVAILABLE DEPARTMENTS & DOCTORS:
${deptList}

KNOWN PATIENT FACTS (do NOT re-ask these):${factSummary || "\n- No prior facts. This appears to be a new patient."}

CONVERSATION RULES:
1. For brand new conversations (when user just says "Hi" or "Hello"), ALWAYS greet them exactly like this: "Hello! 👋 I am the digital assistant for IRAJ Multi-Speciality Hospital, Gajuwaka. I can help you with hospital details or booking an appointment. How can I help you today?"
2. Greet returning patients by name. Never ask for name/phone if already known.
3. To book an appointment, collect: department → doctor → date → time slot → patient name.
4. IMPORTANT: Never ask for the patient's email address.
5. IMPORTANT DATE RULE: When asking the user to choose an appointment date, ALWAYS provide exactly these 3 upcoming dates as options: [OPTIONS: ${next3Days}]. Do not offer past dates.
6. Always call check_availability before confirming a slot — exclude past times for today.
6. After slot is confirmed, ask: "Pay ₹300 online now, or pay at the hospital?"
7. IMPORTANT PAYMENT LOGIC: If the user replies "Online" or "At Hospital", they are choosing a payment mode for their pending appointment! You MUST immediately call set_payment_mode using the Pending Appointment ID from Known Facts. 
8. If set_payment_mode returns a Razorpay link, send it to the user.
9. For slot conflicts (UNIQUE constraint error): apologize, call check_availability again and show other options.
10. Answer general hospital queries (timings, directions, services) using the hospital information above.
11. Keep responses concise, warm, and professional. Use line breaks for readability.
12. If you cannot help or there is an error, say: "Please call us at +91 98010 81080 or visit us directly."
13. Never make up doctor names, slots, or medical advice not listed above.
14. IMPORTANT: When you ask the user to choose from a list of options (e.g., departments, doctors, dates, or "Online"/"At Hospital"), you MUST provide those options using this exact format anywhere in your message: [OPTIONS: Item 1, Item 2, Item 3]. Do NOT exceed 10 options.
Example: "Which department would you like? [OPTIONS: Cardiology, Neurology, Orthopaedics]"`;
}

/**
 * Run a conversation turn with the Gemini model
 * @param {string} systemPrompt
 * @param {Array} history - Array of {role, content} objects
 * @param {string} userMessage
 * @param {Function} functionHandler - async (name, args) => result string
 */
export async function runConversationTurn(systemPrompt, history, userMessage, functionHandler) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    systemInstruction: systemPrompt,
    tools,
  });

  // Convert history to Gemini format
  const geminiHistory = history.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  // Append current user message
  geminiHistory.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  let result = await model.generateContent({ contents: geminiHistory });
  let response = result.response;

  // Log token usage to terminal so you can monitor costs!
  if (response.usageMetadata) {
    console.log(`[Token Usage] Input: ${response.usageMetadata.promptTokenCount} | Output: ${response.usageMetadata.candidatesTokenCount} | Total: ${response.usageMetadata.totalTokenCount}`);
  }

  // Handle function calls in a loop (model may make multiple calls)
  let loopCount = 0;
  let calls = typeof response.functionCalls === 'function' ? response.functionCalls() : response.functionCalls;
  
  while (calls && calls.length > 0 && loopCount < 5) {
    loopCount++;
    const functionResponses = [];

    // Append the exact model response parts (preserves thought_signatures and call_ids)
    geminiHistory.push({
      role: "model",
      parts: result.response.candidates[0].content.parts,
    });

    for (const fc of calls) {
      try {
        const fnResult = await functionHandler(fc.name, fc.args);
        functionResponses.push({
          functionResponse: {
            name: fc.name,
            response: { result: fnResult },
          },
        });
      } catch (err) {
        functionResponses.push({
          functionResponse: {
            name: fc.name,
            response: { error: err.message },
          },
        });
      }
    }

    // Append the user's function response to history
    geminiHistory.push({
      role: "user",
      parts: functionResponses,
    });

    result = await model.generateContent({ contents: geminiHistory });
    response = result.response;
    
    if (response.usageMetadata) {
      console.log(`[Token Usage - FuncCall] Input: ${response.usageMetadata.promptTokenCount} | Output: ${response.usageMetadata.candidatesTokenCount} | Total: ${response.usageMetadata.totalTokenCount}`);
    }
    
    calls = typeof response.functionCalls === 'function' ? response.functionCalls() : response.functionCalls;
  }

  return response.text();
}
