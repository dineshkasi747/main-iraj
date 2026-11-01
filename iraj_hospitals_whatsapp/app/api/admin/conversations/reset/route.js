import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  const { patient_phone } = await req.json();
  if (!patient_phone) return NextResponse.json({ error: "patient_phone required" }, { status: 400 });

  const { error } = await supabase
    .from("conversations")
    .update({ status: "active", last_error: null, updated_at: new Date().toISOString() })
    .eq("patient_phone", patient_phone);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
