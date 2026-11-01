import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(req) {
  const { doctor_id, schedules } = await req.json();
  
  if (!doctor_id || !Array.isArray(schedules)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { error: deleteError } = await supabase.from("doctor_schedules").delete().eq("doctor_id", doctor_id);
  if (deleteError) {
    console.error("Delete Error:", deleteError);
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const toInsert = schedules.map(s => ({
    doctor_id,
    day_of_week: s.day_of_week,
    start_time: s.start_time,
    end_time: s.end_time,
    slot_duration_minutes: parseInt(s.slot_duration_minutes) || 20,
    is_active: s.is_active
  }));

  const { error } = await supabase.from("doctor_schedules").insert(toInsert);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
