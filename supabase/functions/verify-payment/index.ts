/**
 * Edge Function that verifies payment status directly with BOG API.
 * Called from PaymentReturn page to confirm payment and create enrollment.
 * This bypasses the need for callbacks.
 */
import { getPaymentDetails } from "../_shared/ipay.ts";
import { getUserFromRequest, serviceClient } from "../_shared/supabaseClient.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

type VerifyRequest = {
  orderId?: string;
  paymentOrderId?: string;
};

const successStatuses = ["completed", "paid", "success"];

Deno.serve(async (request) => {
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const payload = (await request.json()) as VerifyRequest;
    const { orderId, paymentOrderId } = payload;

    if (!orderId && !paymentOrderId) {
      return new Response("Missing orderId or paymentOrderId", { status: 400, headers: corsHeaders });
    }

    // Find the payment order
    let query = serviceClient
      .from("payment_orders")
      .select("*, courses(slug, title)")
      .eq("user_id", user.id);

    if (orderId) {
      query = query.eq("ipay_order_id", orderId);
    } else if (paymentOrderId) {
      query = query.eq("id", paymentOrderId);
    }

    const { data: paymentOrder, error: poError } = await query.single();

    if (poError || !paymentOrder) {
      console.error("Payment order not found", poError);
      return Response.json({ status: "not_found", message: "Payment order not found" }, { headers: corsHeaders });
    }

    // If already successful, return immediately
    if (paymentOrder.status === "success") {
      return Response.json({
        status: "success",
        message: "Payment already verified",
        course: paymentOrder.courses,
      }, { headers: corsHeaders });
    }

    // If no BOG order ID, we can't verify
    if (!paymentOrder.ipay_order_id) {
      return Response.json({
        status: "pending",
        message: "Payment order not yet submitted to BOG",
      }, { headers: corsHeaders });
    }

    // Call BOG API to get payment details
    console.log("Verifying payment with BOG", paymentOrder.ipay_order_id);
    
    let bogStatus: string | undefined;
    let bogCode: string | undefined;
    let details: Awaited<ReturnType<typeof getPaymentDetails>> | undefined;
    
    try {
      details = await getPaymentDetails(paymentOrder.ipay_order_id);
      bogStatus = details.order_status?.key?.toLowerCase();
      bogCode = details.payment_detail?.code;
      console.log("BOG payment details", { bogStatus, bogCode, orderId: paymentOrder.ipay_order_id });
    } catch (err) {
      console.error("Failed to fetch BOG payment details", err);
      return Response.json({
        status: "pending",
        message: "Could not verify with BOG, please try again",
      }, { headers: corsHeaders });
    }

    if (details) {
      const receiptExternalOrderId = details.external_order_id;
      const receiptAmountRaw =
        details.purchase_units?.request_amount ??
        details.purchase_units?.transfer_amount ??
        details.purchase_units?.refund_amount;
      const receiptAmount =
        typeof receiptAmountRaw === "string" ? parseFloat(receiptAmountRaw) : receiptAmountRaw;
      const receiptCurrency = details.purchase_units?.currency_code?.toUpperCase();
      const expectedCurrency = (paymentOrder.currency_code ?? "").toUpperCase();
      const currencyMatches = !receiptCurrency || receiptCurrency === expectedCurrency;
      const amountMatches =
        receiptAmount === undefined ||
        Number.isNaN(receiptAmount) ||
        Math.abs(Number(paymentOrder.amount) - receiptAmount) < 0.01;

      if (receiptExternalOrderId && receiptExternalOrderId !== paymentOrder.shop_order_id) {
        await serviceClient
          .from("payment_orders")
          .update({
            status: "failed",
            status_description: "external_order_mismatch",
          })
          .eq("id", paymentOrder.id);

        return Response.json({
          status: "failed",
          message: "Order mismatch",
        }, { headers: corsHeaders });
      }

      if (!amountMatches || !currencyMatches) {
        await serviceClient
          .from("payment_orders")
          .update({
            status: "failed",
            status_description: "receipt_amount_currency_mismatch",
          })
          .eq("id", paymentOrder.id);

        return Response.json({
          status: "failed",
          message: "Amount or currency mismatch",
        }, { headers: corsHeaders });
      }
    }

    // Check if payment succeeded
    const isSuccess = successStatuses.includes(bogStatus ?? "") || bogCode === "100";

    if (isSuccess) {
      // Update payment_orders status
      await serviceClient
        .from("payment_orders")
        .update({
          status: "success",
          status_description: bogStatus ?? "completed",
        })
        .eq("id", paymentOrder.id);

      // Create enrollment
      const { error: enrollError } = await serviceClient
        .from("course_enrollments")
        .upsert(
          {
            user_id: paymentOrder.user_id,
            course_id: paymentOrder.course_id,
            price_paid: paymentOrder.amount,
            payment_status: "paid",
            ipay_order_id: paymentOrder.ipay_order_id,
            paid_at: new Date().toISOString(),
          },
          { onConflict: "user_id,course_id" }
        );

      if (enrollError) {
        console.error("Failed to create enrollment", enrollError);
      }

      console.log("Payment verified and enrollment created", {
        userId: paymentOrder.user_id,
        courseId: paymentOrder.course_id,
      });

      return Response.json({
        status: "success",
        message: "Payment verified successfully",
        course: paymentOrder.courses,
      }, { headers: corsHeaders });
    }

    // Check for failed statuses
    const failedStatuses = ["rejected", "failed", "declined", "cancelled", "canceled"];
    if (failedStatuses.includes(bogStatus ?? "")) {
      await serviceClient
        .from("payment_orders")
        .update({
          status: "failed",
          status_description: bogStatus,
        })
        .eq("id", paymentOrder.id);

      return Response.json({
        status: "failed",
        message: "Payment was declined or cancelled",
      }, { headers: corsHeaders });
    }

    // Still pending
    return Response.json({
      status: "pending",
      message: "Payment is still being processed",
      bogStatus,
    }, { headers: corsHeaders });

  } catch (error) {
    console.error("Verify payment error", error);
    return Response.json({
      status: "error",
      message: "Unexpected error",
    }, { status: 500, headers: corsHeaders });
  }
});
