/**
 * Edge Function that processes Bank of Georgia iPay callbacks.
 * Updates payment_orders and synchronizes course_enrollments.
 */
import { getPaymentDetails } from "../_shared/ipay.ts";
import { serviceClient } from "../_shared/supabaseClient.ts";

type CallbackPayload = {
  event?: string;
  order_id?: string;
  external_order_id?: string;
  order_status?: {
    key?: string;
    value?: string;
  };
  payment_detail?: {
    code?: string;
    code_description?: string;
    transaction_id?: string;
  };
  body?: {
    order_id?: string;
    external_order_id?: string;
    order_status?: {
      key?: string;
      value?: string;
    };
    payment_detail?: {
      code?: string;
      code_description?: string;
      transaction_id?: string;
    };
  };
};

type PaymentOrderStatus = "pending" | "redirected" | "success" | "failed" | "cancelled";

const CALLBACK_PUBLIC_KEY = Deno.env.get("IPAY_CALLBACK_PUBLIC_KEY")?.trim() ?? null;

const successKeys = ["paid", "captured", "authorized", "success", "succeeded", "completed"];
const pendingKeys = ["pending", "created", "processing", "in_progress"];
const cancelledKeys = ["refunded", "cancelled", "canceled", "reversed", "voided"];
const failedKeys = ["declined", "failed", "rejected", "error"];

function mapStatus(statusKey?: string, code?: string): PaymentOrderStatus {
  const normalizedKey = (statusKey ?? "").toLowerCase();
  if (successKeys.includes(normalizedKey) || code === "100") return "success";
  if (pendingKeys.includes(normalizedKey)) return "pending";
  if (cancelledKeys.includes(normalizedKey)) return "cancelled";
  if (failedKeys.includes(normalizedKey)) return "failed";
  // Fallback: treat unknown as failed to avoid granting access on ambiguous callbacks
  return "failed";
}

async function verifySignature(signatureBase64: string, payload: string): Promise<boolean> {
  if (!CALLBACK_PUBLIC_KEY) return true;
  try {
    const pem = CALLBACK_PUBLIC_KEY.replace("-----BEGIN PUBLIC KEY-----", "")
      .replace("-----END PUBLIC KEY-----", "")
      .replace(/\s+/g, "");
    const binary = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
    const key = await crypto.subtle.importKey(
      "spki",
      binary.buffer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["verify"],
    );

    const signatureBytes = Uint8Array.from(atob(signatureBase64), (c) => c.charCodeAt(0));
    const verified = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      signatureBytes,
      new TextEncoder().encode(payload),
    );
    return verified;
  } catch (error) {
    console.error("Failed to verify callback signature", error);
    return false;
  }
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const rawBody = await request.text();

    const signatureHeader =
      request.headers.get("signature") ??
      request.headers.get("Signature") ??
      request.headers.get("x-signature");
    if (signatureHeader) {
      const verified = await verifySignature(signatureHeader, rawBody);
      if (!verified) {
        console.error("Callback signature verification failed");
        return new Response("Invalid signature", { status: 401 });
      }
    }

    const body = JSON.parse(rawBody) as CallbackPayload;

    const orderId = body.body?.order_id ?? body.order_id;
    const externalOrderId = body.body?.external_order_id ?? body.external_order_id;
    const statusKey = body.body?.order_status?.key ?? body.order_status?.key;
    const code = body.body?.payment_detail?.code ?? body.payment_detail?.code;
    const transactionId =
      body.body?.payment_detail?.transaction_id ?? body.payment_detail?.transaction_id;

    if (!orderId && !externalOrderId) {
      return new Response("Missing order identifiers", { status: 400 });
    }

    let { data: paymentOrder, error } = await serviceClient
      .from("payment_orders")
      .select("*")
      .or(
        [
          orderId ? `ipay_order_id.eq.${orderId}` : "",
          externalOrderId ? `shop_order_id.eq.${externalOrderId}` : "",
        ]
          .filter(Boolean)
          .join(","),
      )
      .single();

    if (error || !paymentOrder) {
      console.error("Payment order not found for callback", { error, orderId, externalOrderId });
      return new Response("Not Found", { status: 404 });
    }

    // If the order is already in a terminal success state and callback reports success, skip.
    const normalizedStatusFromBody = mapStatus(statusKey, code);
    if (
      paymentOrder.status === "success" &&
      (normalizedStatusFromBody === "success" || normalizedStatusFromBody === "pending")
    ) {
      return Response.json({ received: true, already_processed: true });
    }

    // Fetch receipt details to confirm status from the Payments API.
    let detailsStatusKey = statusKey;
    let detailsCode = code;
    let detailsDescription: string | undefined;
    try {
      if (orderId) {
        const details = await getPaymentDetails(orderId);
        detailsStatusKey = details.order_status?.key ?? detailsStatusKey;
        detailsCode = details.payment_detail?.code ?? detailsCode;
        detailsDescription = details.payment_detail?.code_description ?? detailsDescription;
      }
    } catch (err) {
      console.error("Failed to fetch payment details for callback", err);
    }

    const normalizedStatus = mapStatus(detailsStatusKey, detailsCode);

    await serviceClient
      .from("payment_orders")
      .update({
        status: normalizedStatus,
        status_description:
          detailsDescription ??
          detailsCode ??
          detailsStatusKey ??
          statusKey ??
          normalizedStatus,
        ipay_order_id: orderId ?? paymentOrder.ipay_order_id,
        ipay_payment_id: transactionId ?? paymentOrder.ipay_payment_id,
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
            ipay_order_id: orderId ?? paymentOrder.ipay_order_id,
            ipay_payment_id: transactionId ?? paymentOrder.ipay_payment_id,
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
          ipay_order_id: orderId ?? paymentOrder.ipay_order_id,
          ipay_payment_id: transactionId ?? paymentOrder.ipay_payment_id,
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
