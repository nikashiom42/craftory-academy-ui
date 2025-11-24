/**
 * Shared Supabase service client helpers for Edge Functions.
 * Centralizes auth lookups so every function validates callers consistently.
 */
import { createClient, type User } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
}

/**
 * Supabase service client with elevated privileges (Edge Functions only).
 */
export const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
  },
});

/**
 * Extracts and validates the Supabase user from the Authorization header.
 */
export async function getUserFromRequest(request: Request): Promise<User | null> {
  const authHeader = request.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await serviceClient.auth.getUser(token);

  if (error) {
    console.error("Failed to load user from token", error);
    return null;
  }

  return user;
}

