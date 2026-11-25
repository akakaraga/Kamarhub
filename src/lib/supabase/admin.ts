import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * Server-only Supabase client with Service Role Key.
 * ONLY use in Server Actions / API Routes after verifying user session & tenant ownership!
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
