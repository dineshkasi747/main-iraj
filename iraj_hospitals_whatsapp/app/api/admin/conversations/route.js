import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const statuses = searchParams.get("status")?.split(",") || [];

  let query = supabase
    .from("conversations")
    .select("patient_phone, status, updated_at, known_facts, last_error")
    .order("updated_at", { ascending: false })
    .limit(50);

  if (statuses.length) query = query.in("status", statuses);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ conversations: data || [] });
}
