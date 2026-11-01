import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { count } = await supabase
    .from("error_logs")
    .select("*", { count: "exact", head: true })
    .eq("resolved", false);
  return NextResponse.json({ count: count || 0 });
}
