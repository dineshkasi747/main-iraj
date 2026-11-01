import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase.from("doctors").select("*").eq("is_active", true).order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ doctors: data || [] });
}
export async function POST(req) {
  const { name, department_id, qualification, specialization, registration_number } = await req.json();
  
  if (!name || !department_id) {
    return NextResponse.json({ error: "Name and Department are required" }, { status: 400 });
  }

  const doctorName = name.startsWith("Dr. ") ? name : `Dr. ${name}`;

  const { data, error } = await supabase.from("doctors").insert({
    name: doctorName,
    department_id,
    qualification: qualification || null,
    specialization: specialization || null,
    registration_number: registration_number || null,
    is_active: true
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Seed default Mon-Sat schedule
  const defaultSchedules = [];
  for (let i = 1; i <= 6; i++) {
    defaultSchedules.push({
      doctor_id: data.id,
      day_of_week: i,
      start_time: "09:00:00",
      end_time: "17:00:00",
      slot_duration_minutes: 20,
      is_active: true
    });
  }
  await supabase.from("doctor_schedules").insert(defaultSchedules);

  return NextResponse.json({ success: true, doctor: data });
}
