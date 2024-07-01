import type { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react";

const SupabaseBrowserClientContext = createContext<SupabaseClient | null>(null);

export default SupabaseBrowserClientContext;
