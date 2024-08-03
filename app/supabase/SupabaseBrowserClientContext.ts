import type { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react";
import type { Database } from "./supabase.types";

const SupabaseBrowserClientContext =
  createContext<SupabaseClient<Database> | null>(null);

export default SupabaseBrowserClientContext;
