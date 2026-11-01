import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(req, { params }) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const { error } = await supabase.from("departments").update({ name }).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}

export async function DELETE(req, { params }) {
  // Prevent deletion if there are active doctors
  const { data: doctors } = await supabase
    .from("doctors")
    .select("id")
    .eq("department_id", params.id)
    .eq("is_active", true);
    
  if (doctors && doctors.length > 0) {
    return NextResponse.json({ 
      error: "Cannot delete department with active doctors. Disable or reassign them first." 
    }, { status: 400 });
  }

  const { error } = await supabase.from("departments").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}
