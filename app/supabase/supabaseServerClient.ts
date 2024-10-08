import { createServerClient, serialize } from "@supabase/ssr";
import type { Database } from "./supabase.types";
const supabaseServerClient = (
  cookies: Record<string, string>,
  headers: Headers
) =>
  createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    }
  );

export default supabaseServerClient;
