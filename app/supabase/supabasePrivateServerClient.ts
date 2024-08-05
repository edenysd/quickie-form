import type { Database } from "./supabase.types";
import { createClient } from "@supabase/supabase-js";

const supabasePrivateServerClient = () =>
  createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

export default supabasePrivateServerClient;
