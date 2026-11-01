import { createClient } from "@supabase/supabase-js";

// Supabase project: qfgrgjxsruasgmkfphoy
const targetUrl = "https://qfgrgjxsruasgmkfphoy.supabase.co";
const targetKey = "sb_publishable_Ilz1XxQlXOuQ0FcNJYZPiA_OuxOmneU";

// Ensure project qfgrgjxsruasgmkfphoy is used even if old env var is cached
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const shouldUseTarget = !envUrl || envUrl.includes("ahcicqtcenebkbpglwwv") || envUrl.includes("qfgrgjxsruasgmkfphoy");

const supabaseUrl = shouldUseTarget ? targetUrl : envUrl;
const supabaseKey = shouldUseTarget
  ? targetKey
  : (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || targetKey);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});