/**
 * TBC Bank E-Commerce Hosted Checkout Integration
 * Handles payment initiation, callbacks, and confirmation for course enrollments
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TBCAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface TBCPaymentResponse {
  payId: string;
  status: string;
  payment_url?: string;
  links?: Array<{ uri: string; method: string; rel: string }>;
}

interface TBCPaymentDetails {
  payId: string;
  status: string;
  amount: number;
  currency: string;
  description?: string;
}

// Get TBC access token
async function getTBCAccessToken(): Promise<string> {
  const TBC_BASE_URL = Deno.env.get("TBC_BASE_URL") || "https://api.tbcbank.ge";
  const TBC_CLIENT_ID = Deno.env.get("TBC_CLIENT_ID");
  const TBC_CLIENT_SECRET = Deno.env.get("TBC_CLIENT_SECRET");
  const TBC_API_KEY = Deno.env.get("TBC_API_KEY");

  const response = await fetch(`${TBC_BASE_URL}/tpay/access-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": TBC_API_KEY!,
    },
    body: JSON.stringify({
      client_id: TBC_CLIENT_ID,
      client_secret: TBC_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get TBC access token: ${response.statusText}`);
  }

  const data: TBCAccessTokenResponse = await response.json();
  return data.access_token;
}

// Create TBC payment session
async function createTBCPayment(
  accessToken: string,
  amount: number,
  description: string,
  returnUrl: string,
  callbackUrl: string
): Promise<TBCPaymentResponse> {
  const TBC_BASE_URL = Deno.env.get("TBC_BASE_URL") || "https://api.tbcbank.ge";
  const TBC_API_KEY = Deno.env.get("TBC_API_KEY");

  const response = await fetch(`${TBC_BASE_URL}/tpay/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": TBC_API_KEY!,
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      amount: {
        total: amount,
        currency: "GEL",
      },
      returnurl: returnUrl,
      callbackUrl: callbackUrl,
      description: description,
      methods: [1], // Card payment
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create TBC payment: ${response.statusText} - ${errorText}`);
  }

  const data: TBCPaymentResponse = await response.json();
  return data;
}

// Get TBC payment details
async function getTBCPaymentDetails(accessToken: string, payId: string): Promise<TBCPaymentDetails> {
  const TBC_BASE_URL = Deno.env.get("TBC_BASE_URL") || "https://api.tbcbank.ge";
  const TBC_API_KEY = Deno.env.get("TBC_API_KEY");

  const response = await fetch(`${TBC_BASE_URL}/tpay/payments/${payId}`, {
    method: "GET",
    headers: {
      "apikey": TBC_API_KEY!,
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get TBC payment details: ${response.statusText}`);
  }

  const data: TBCPaymentDetails = await response.json();
  return data;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Route: POST /tbc-payment/initiate - Create payment session
    if (path.endsWith("/initiate") && req.method === "POST") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Missing authorization" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify user token
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
      
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Invalid authorization" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { courseId, amount, returnUrl } = await req.json();

      if (!courseId || !amount || !returnUrl) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get course details
      const { data: course, error: courseError } = await supabaseClient
        .from("courses")
        .select("title")
        .eq("id", courseId)
        .single();

      if (courseError || !course) {
        return new Response(JSON.stringify({ error: "Course not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create pending enrollment
      const { data: enrollment, error: enrollmentError } = await supabaseClient
        .from("course_enrollments")
        .insert({
          user_id: user.id,
          course_id: courseId,
          price_paid: amount,
          payment_status: "pending",
        })
        .select()
        .single();

      if (enrollmentError) {
        if (enrollmentError.code === "23505") {
          return new Response(JSON.stringify({ error: "Already enrolled in this course" }), {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw enrollmentError;
      }

      // Get TBC access token
      const accessToken = await getTBCAccessToken();

      // Create TBC payment
      const callbackUrl = `${supabaseUrl}/functions/v1/tbc-payment/callback`;
      const description = `Course: ${course.title}`;
      
      const payment = await createTBCPayment(
        accessToken,
        amount,
        description,
        returnUrl,
        callbackUrl
      );

      // Update enrollment with TBC payment ID
      await supabaseClient
        .from("course_enrollments")
        .update({
          tbc_payment_id: payment.payId,
        })
        .eq("id", enrollment.id);

      // Extract payment URL from response
      const paymentUrl = payment.payment_url || 
        payment.links?.find(link => link.rel === "redirect")?.uri;

      return new Response(
        JSON.stringify({
          success: true,
          redirectUrl: paymentUrl,
          payId: payment.payId,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Route: POST /tbc-payment/callback - Handle TBC callback
    if (path.endsWith("/callback") && req.method === "POST") {
      const payload = await req.json();
      const { payId, status } = payload;

      if (!payId) {
        return new Response(JSON.stringify({ error: "Missing payId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get access token to verify payment
      const accessToken = await getTBCAccessToken();
      const paymentDetails = await getTBCPaymentDetails(accessToken, payId);

      // Update enrollment based on payment status
      let paymentStatus: string;
      let paidAt: string | null = null;

      if (paymentDetails.status === "Success" || paymentDetails.status === "Succeeded") {
        paymentStatus = "paid";
        paidAt = new Date().toISOString();
      } else if (paymentDetails.status === "Failed" || paymentDetails.status === "Cancelled") {
        paymentStatus = "failed";
      } else {
        paymentStatus = "pending";
      }

      await supabaseClient
        .from("course_enrollments")
        .update({
          payment_status: paymentStatus,
          paid_at: paidAt,
        })
        .eq("tbc_payment_id", payId);

      return new Response(
        JSON.stringify({ success: true, status: paymentStatus }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Route: GET /tbc-payment/confirm - Confirm payment status
    if (path.endsWith("/confirm") && req.method === "GET") {
      const payId = url.searchParams.get("payId");

      if (!payId) {
        return new Response(JSON.stringify({ error: "Missing payId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get enrollment by payment ID
      const { data: enrollment, error: enrollmentError } = await supabaseClient
        .from("course_enrollments")
        .select("payment_status, paid_at")
        .eq("tbc_payment_id", payId)
        .single();

      if (enrollmentError || !enrollment) {
        return new Response(JSON.stringify({ error: "Enrollment not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // If not already paid, check with TBC
      if (enrollment.payment_status === "pending") {
        const accessToken = await getTBCAccessToken();
        const paymentDetails = await getTBCPaymentDetails(accessToken, payId);

        let paymentStatus: string;
        let paidAt: string | null = null;

        if (paymentDetails.status === "Success" || paymentDetails.status === "Succeeded") {
          paymentStatus = "paid";
          paidAt = new Date().toISOString();
        } else if (paymentDetails.status === "Failed" || paymentDetails.status === "Cancelled") {
          paymentStatus = "failed";
        } else {
          paymentStatus = "pending";
        }

        await supabaseClient
          .from("course_enrollments")
          .update({
            payment_status: paymentStatus,
            paid_at: paidAt,
          })
          .eq("tbc_payment_id", payId);

        return new Response(
          JSON.stringify({ status: paymentStatus, paid_at: paidAt }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ status: enrollment.payment_status, paid_at: enrollment.paid_at }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

