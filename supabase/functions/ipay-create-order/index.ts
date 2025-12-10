/**
 * Edge Function that creates an iPay checkout order and returns the redirect URL.
 */
import { createIpayOrder, getApproveLink } from "../_shared/ipay.ts";
import { getUserFromRequest, serviceClient } from "../_shared/supabaseClient.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

const IPAY_REDIRECT_URL = Deno.env.get("IPAY_REDIRECT_URL");
const IPAY_REDIRECT_FAIL_URL = Deno.env.get("IPAY_REDIRECT_FAIL_URL") ?? IPAY_REDIRECT_URL;
const IPAY_CALLBACK_URL = Deno.env.get("IPAY_CALLBACK_URL");

type CreateOrderRequest = {
  courseId: string;
  locale?: string;
  paymentMethod?: "bog_loan" | "bnpl";
  installmentMonths?: number;
  discountCode?: string;
};

const currencyCode = Deno.env.get("IPAY_CURRENCY_CODE") ?? "GEL";

Deno.serve(async (request) => {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  const user = await getUserFromRequest(request);
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
      headers: corsHeaders,
    });
  }

  try {
    const payload = (await request.json()) as CreateOrderRequest;
    const courseId = payload.courseId;

    if (!courseId) {
      return new Response("Missing courseId", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!IPAY_REDIRECT_URL || !IPAY_CALLBACK_URL) {
      return new Response("Missing iPay redirect or callback URLs", {
        status: 500,
        headers: corsHeaders,
      });
    }

    const { data: course, error: courseError } = await serviceClient
      .from("courses")
      .select("id, title, price")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      console.error("Course lookup failed", courseError);
      return new Response("Course not found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    const amount = Number(course.price ?? 0);

    if (Number.isNaN(amount) || amount <= 0) {
      return new Response("Course price is not configured", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const shopOrderId = `CRA-${courseId.split("-")[0]}-${crypto.randomUUID().slice(0, 12)}`;
    const locale = payload.locale ?? "ka";
    const now = new Date().toISOString();

    const { data: paymentOrder, error: insertError } = await serviceClient
      .from("payment_orders")
      .insert({
        user_id: user.id,
        course_id: course.id,
        course_title: course.title,
        shop_order_id: shopOrderId,
        amount,
        currency_code: currencyCode,
        locale,
        intent: "CAPTURE",
        status: "pending",
        metadata: payload.paymentMethod ? {
          createdFrom: "ipay-create-order",
          created_at: now,
          payment_method: payload.paymentMethod,
          installment_months: payload.installmentMonths,
          discount_code: payload.discountCode,
        } : {
          createdFrom: "ipay-create-order",
          created_at: now,
        },
      })
      .select()
      .single();

    if (insertError || !paymentOrder) {
      console.error("Failed to insert payment order", insertError);
      return new Response("Unable to create payment session", {
        status: 500,
        headers: corsHeaders,
      });
    }

    const ipayResponse = await createIpayOrder({
      amount,
      currencyCode,
      courseId: course.id,
      courseTitle: course.title,
      locale,
      redirectUrlSuccess: IPAY_REDIRECT_URL,
      redirectUrlFail: IPAY_REDIRECT_FAIL_URL,
      callbackUrl: IPAY_CALLBACK_URL,
      shopOrderId,
      // Pass installment parameters
      paymentMethod: payload.paymentMethod,
      installmentMonths: payload.installmentMonths,
      discountCode: payload.discountCode,
    });

    const approveLink = getApproveLink(ipayResponse);
    if (!approveLink) {
      console.error("Approve link missing on BOG response", ipayResponse);
      await serviceClient
        .from("payment_orders")
        .update({
          status: "failed",
          status_description: "Missing redirect link in BOG response",
          ipay_order_id: ipayResponse.id,
        })
        .eq("id", paymentOrder.id);

      return new Response("Unable to create payment link", {
        status: 502,
        headers: corsHeaders,
      });
    }

    console.log("BOG order created successfully", { orderId: ipayResponse.id, redirectUrl: approveLink });

    await serviceClient
      .from("payment_orders")
      .update({
        status: "redirected",
        status_description: "Redirect to BOG payment page",
        redirect_url: approveLink,
        callback_url: IPAY_CALLBACK_URL,
        ipay_order_id: ipayResponse.id,
      })
      .eq("id", paymentOrder.id);

    return Response.json(
      {
        redirectUrl: approveLink,
        shopOrderId,
        orderId: ipayResponse.id,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("iPay create order failed", error);
    return new Response("Unexpected error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});

