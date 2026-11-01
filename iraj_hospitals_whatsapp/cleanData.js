const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanData() {
  console.log("Cleaning test data...");

  // Delete from leads first (foreign key to appointments)
  const { error: leadsErr } = await supabase.from("leads").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (leadsErr) console.error("Error deleting leads:", leadsErr);

  // Delete from appointments
  const { error: apptsErr } = await supabase.from("appointments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (apptsErr) console.error("Error deleting appointments:", apptsErr);

  // Delete from conversations
  const { error: convErr } = await supabase.from("conversations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (convErr) console.error("Error deleting conversations:", convErr);

  // Delete from error_logs
  const { error: errsErr } = await supabase.from("error_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (errsErr) console.error("Error deleting error_logs:", errsErr);

  console.log("Data cleaned successfully! (Doctors and Departments preserved)");
}

cleanData();
