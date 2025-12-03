import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleCors, addCorsHeaders } from "../_shared/cors.ts";
import { getUserFromRequest, serviceClient } from "../_shared/supabaseClient.ts";

type ResetPayload = {
  userId?: string;
  newPassword?: string;
};

export default async function handler(req: Request): Promise<Response> {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const caller = await getUserFromRequest(req);
    if (!caller) {
      return addCorsHeaders(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
    }

    const payload = (await req.json()) as ResetPayload;
    if (!payload.userId || !payload.newPassword) {
      return addCorsHeaders(new Response(JSON.stringify({ error: "Missing userId or newPassword" }), { status: 400 }));
    }

    if (payload.newPassword.length < 6) {
      return addCorsHeaders(new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), { status: 400 }));
    }

    const { error: updateError } = await serviceClient.auth.admin.updateUserById(payload.userId, {
      password: payload.newPassword,
    });

    if (updateError) {
      console.error("Failed to reset password", updateError);
      return addCorsHeaders(
        new Response(JSON.stringify({ error: updateError.message || "Reset failed" }), { status: 400 }),
      );
    }

    return addCorsHeaders(new Response(JSON.stringify({ success: true }), { status: 200 }));
  } catch (error) {
    console.error("Unhandled error resetting password", error);
    return addCorsHeaders(new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 }));
  }
}

Deno.serve(handler);
