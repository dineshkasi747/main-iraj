import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(req) {
  const body = await req.json();
  const { error } = await supabase
    .from("settings")
    .update({ ...body, updated_at: new Date().toISOString() })
    .not("id", "is", null); // Update the single row

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
