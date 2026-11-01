import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function DELETE(req, { params }) {
  const { id } = params;
  
  if (!id) {
    return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
  }

  const { error } = await supabase.from("leads").delete().eq("id", id);
  
  if (error) {
    console.error("Delete lead error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
