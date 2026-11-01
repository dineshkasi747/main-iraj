import { supabase } from "@/lib/supabaseClient";
import SettingsClient from "./SettingsClient";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [{ data: settings }, { data: contextRow }] = await Promise.all([
    supabase.from("settings").select("*").single(),
    supabase.from("hospital_context").select("*").order("updated_at", { ascending: false }).limit(1).single(),
  ]);

  return <SettingsClient initialSettings={settings || {}} initialContext={contextRow?.content || ""} contextId={contextRow?.id} />;
}
