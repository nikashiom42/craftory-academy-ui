import "jsr:@supabase/functions-js/edge-runtime.d.ts";
/**
 * Edge Function that surfaces iPay OAuth token metadata for internal health checks.
 * Requires a shared secret header so tokens are not exposed publicly.
 */
import { getOAuthToken } from "../_shared/ipay.ts";

const INTERNAL_KEY = Deno.env.get("IPAY_AUTH_INTERNAL_KEY");

Deno.serve(async (request) => {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (INTERNAL_KEY) {
    const headerKey = request.headers.get("x-ipay-internal-key");
    if (headerKey !== INTERNAL_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  try {
    const token = await getOAuthToken(false);
    return Response.json({
      access_token: token.accessToken,
      expires_in: token.expiresIn,
      scope: token.scope,
    });
  } catch (error) {
    console.error("iPay auth function failed", error);
    return new Response("Failed to fetch token", { status: 502 });
  }
});

