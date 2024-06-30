import { createClient } from "@supabase/supabase-js";
import { envVariables } from "../config";
import { Database } from "../types/supabase-db";

export const supabase = createClient<Database>(
  envVariables.SUPABASE_URL,
  envVariables.SUPABASE_ANON_KEY,
);

export const getLoggedInUserId = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error("Failed to get user session");

  if (!data.session) throw new Error("No user session found");

  return data.session.user.id;
};
