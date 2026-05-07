import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");
}

/**
 * Server-only Supabase client using the service role key.
 * Bypasses RLS — only ever used in API routes and Server Components.
 * Never import this in client components.
 */
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
