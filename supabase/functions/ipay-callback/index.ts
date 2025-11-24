/**
 * Edge Function that processes Bank of Georgia iPay callbacks.
 * Updates payment_orders and synchronizes course_enrollments.
 */
import { serviceClient } from "../_shared/supabaseClient.ts";

type CallbackPayload = {
  status: string;
  status_description?: string;
  payment_hash?: string;
  order_id?: string;
  payment_id?: string;
  ipay_payment_id?: string;
  shop_order_id?: string;
};

type PaymentOrderStatus = "pending" | "redirected" | "success" | "failed" | "cancelled";

const statusMap: Record<string, PaymentOrderStatus> = {
  COMPLETED: "success",
  APPROVED: "success",
  CAPTURED: "success",
  SUCCESS: "success",
  SUCCEEDED: "success",
  PAID: "success",
  PENDING: "pending",
  IN_PROGRESS: "pending",
  CREATED: "pending",
  DECLINED: "failed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REVERSED: "cancelled",
};

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = (await request.json()) as CallbackPayload;

    if (!body.shop_order_id) {
      return new Response("Missing shop_order_id", { status: 400 });
    }

    const { data: paymentOrder, error } = await serviceClient
      .from("payment_orders")
      .select("*")
      .eq("shop_order_id", body.shop_order_id)
      .single();

    if (error || !paymentOrder) {
      console.error("Payment order not found for callback", error);
      return new Response("Not Found", { status: 404 });
    }

    if (
      paymentOrder.ipay_payment_hash &&
      body.payment_hash &&
      paymentOrder.ipay_payment_hash !== body.payment_hash
    ) {
      console.error("Payment hash mismatch", paymentOrder.id);
      return new Response("Hash mismatch", { status: 409 });
    }

    const normalizedStatus = statusMap[body.status?.toUpperCase() ?? ""] ?? "failed";

    await serviceClient
      .from("payment_orders")
      .update({
        status: normalizedStatus,
        status_description: body.status_description ?? body.status,
        ipay_order_id: body.order_id ?? paymentOrder.ipay_order_id,
        ipay_payment_id: body.payment_id ?? body.ipay_payment_id ?? paymentOrder.ipay_payment_id,
        ipay_payment_hash: body.payment_hash ?? paymentOrder.ipay_payment_hash,
      })
      .eq("id", paymentOrder.id);

    if (normalizedStatus === "success") {
      await serviceClient
        .from("course_enrollments")
        .upsert(
          {
            user_id: paymentOrder.user_id,
            course_id: paymentOrder.course_id,
            price_paid: paymentOrder.amount,
            payment_status: "paid",
            ipay_order_id: body.order_id ?? paymentOrder.ipay_order_id,
            ipay_payment_id: body.payment_id ?? paymentOrder.ipay_payment_id,
            ipay_payment_hash: body.payment_hash ?? paymentOrder.ipay_payment_hash,
            paid_at: new Date().toISOString(),
          },
          { onConflict: "user_id,course_id" },
        );
    }

    if (normalizedStatus === "failed" || normalizedStatus === "cancelled") {
      await serviceClient
        .from("course_enrollments")
        .update({
          payment_status: "failed",
          ipay_order_id: body.order_id ?? paymentOrder.ipay_order_id,
          ipay_payment_id: body.payment_id ?? paymentOrder.ipay_payment_id,
          ipay_payment_hash: body.payment_hash ?? paymentOrder.ipay_payment_hash,
        })
        .eq("user_id", paymentOrder.user_id)
        .eq("course_id", paymentOrder.course_id);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("iPay callback processing failed", error);
    return new Response("Unexpected error", { status: 500 });
  }
});

