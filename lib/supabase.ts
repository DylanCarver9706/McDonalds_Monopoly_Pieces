import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

// Client-side Supabase client (uses anon key)
export const supabase = createClient(
  supabaseUrl as string,
  supabaseAnonKey as string
);

// Server-side client with service role key for admin operations
// This should only be used in API routes and server-side code
export const supabaseAdmin = createClient(
  supabaseUrl as string,
  supabaseServiceRoleKey as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
