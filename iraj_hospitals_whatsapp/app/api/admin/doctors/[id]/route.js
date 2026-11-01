import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(req, { params }) {
  const body = await req.json();
  
  // Format name if it's being updated
  if (body.name && !body.name.startsWith("Dr. ") && !body.name.startsWith("Dr ")) {
    body.name = `Dr. ${body.name}`;
  }

  // The body might contain is_active for soft deletion, or name/qualifications for edits
  const { error } = await supabase.from("doctors").update(body).eq("id", params.id);
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}
