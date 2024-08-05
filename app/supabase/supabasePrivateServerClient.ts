import type { Database } from "./supabase.types";
import { createClient } from "@supabase/supabase-js";

const supabasePrivateServerClient = () =>
  createClient<Database>(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

export default supabasePrivateServerClient;
