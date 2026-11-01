import { supabase } from "@/lib/supabaseClient";
import DailyClient from "./DailyClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DailyPage() {
  const now = new Date();
  const todayIST = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("id, patient_name, patient_phone, appointment_date, appointment_time, status, payment_status, source, doctors(name, departments(name))")
    .eq("appointment_date", todayIST)
    .neq("status", "completed")
    .neq("status", "cancelled")
    .order("appointment_time", { ascending: true });

  if (error) {
    console.error("Daily Queue Fetch Error:", error);
  }

  return (
    <DailyClient 
      initialAppointments={appointments || []} 
      todayIST={todayIST}
    />
  );
}
