const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const API_BASE_ENDPOINT = import.meta.env.VITE_API_BASE_ENDPOINT;

if (!SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL env variable is not defined");
}

if (!SUPABASE_ANON_KEY) {
  throw new Error("VITE_SUPABASE_ANON_KEY env variable is not defined");
}

if (!API_BASE_ENDPOINT) {
  throw new Error("VITE_API_BASE_ENDPOINT env variable is not defined");
}

export const envVariables = {
  SUPABASE_URL: SUPABASE_URL || "",
  SUPABASE_ANON_KEY: SUPABASE_ANON_KEY || "",
  API_BASE_ENDPOINT: API_BASE_ENDPOINT || "",
};
