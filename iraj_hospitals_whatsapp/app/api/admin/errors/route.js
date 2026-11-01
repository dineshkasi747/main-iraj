import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const resolved = searchParams.get("resolved");

  let query = supabase
    .from("error_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (resolved === "false") query = query.eq("resolved", false);
  if (resolved === "true") query = query.eq("resolved", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ errors: data || [] });
}
