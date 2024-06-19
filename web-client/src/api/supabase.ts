import { createClient } from "@supabase/supabase-js";
import { envVariables } from "../config";
import { Database } from "../types/supabase-db";

export const supabase = createClient<Database>(
  envVariables.SUPABASE_URL,
  envVariables.SUPABASE_ANON_KEY,
);
