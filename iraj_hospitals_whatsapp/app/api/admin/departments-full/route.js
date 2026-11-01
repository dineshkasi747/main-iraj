import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from("departments")
    .select("id, name, doctors(id, name, specialization, qualification, registration_number, is_active, department_id, doctor_schedules(id, day_of_week, start_time, end_time, slot_duration_minutes, is_active))")
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ departments: data || [] });
}
