import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';

export async function GET() {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  try {
    const [
      { count: todayTotal },
      { count: pending },
      { count: confirmed },
      { count: waitingErrors },
      { data: todayAppts },
      { data: recentConvs },
    ] = await Promise.all([
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("appointment_date", today),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("appointment_date", today).eq("status", "pending_payment"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("appointment_date", today).eq("status", "confirmed"),
      supabase.from("error_logs").select("id", { count: "exact", head: true }).eq("resolved", false),
      supabase
        .from("appointments")
        .select("id, patient_name, patient_phone, appointment_date, appointment_time, status, payment_status, doctors(name), source")
        .eq("appointment_date", today)
        .order("appointment_time", { ascending: true })
        .limit(30),
      supabase
        .from("conversations")
        .select("patient_phone, status, updated_at, known_facts")
        .in("status", ["error", "active"])
        .order("updated_at", { ascending: false })
        .limit(5),
    ]);

    return NextResponse.json({
      stats: {
        todayTotal: todayTotal || 0,
        pending: pending || 0,
        confirmed: confirmed || 0,
        waitingErrors: waitingErrors || 0,
      },
      todayAppts: todayAppts || [],
      recentConvs: recentConvs || [],
      today
    });
  } catch (err) {
    console.error("[Dashboard Stats] Error:", err.message);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
