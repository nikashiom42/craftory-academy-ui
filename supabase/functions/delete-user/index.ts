import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleCors, addCorsHeaders } from "../_shared/cors.ts";
import { getUserFromRequest, serviceClient } from "../_shared/supabaseClient.ts";

type DeletePayload = {
  userId?: string;
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

    const payload = (await req.json()) as DeletePayload;
    if (!payload.userId) {
      return addCorsHeaders(new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 }));
    }

    const { error: deleteAuthError } = await serviceClient.auth.admin.deleteUser(payload.userId);
    if (deleteAuthError) {
      console.error("Failed to delete auth user", deleteAuthError);
      return addCorsHeaders(
        new Response(JSON.stringify({ error: deleteAuthError.message || "Delete failed" }), { status: 400 }),
      );
    }

    // Clean up profile (and cascaded enrollments) if present
    const { error: deleteProfileError } = await serviceClient.from("profiles").delete().eq("id", payload.userId);
    if (deleteProfileError) {
      console.error("Failed to delete profile", deleteProfileError);
    }

    return addCorsHeaders(new Response(JSON.stringify({ success: true }), { status: 200 }));
  } catch (error) {
    console.error("Unhandled error deleting user", error);
    return addCorsHeaders(new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 }));
  }
}

Deno.serve(handler);
