/**
 * Shared Bank of Georgia Payments helper utilities for Edge Functions.
 * Uses the new Payments API (https://api.bog.ge/payments/v1) with client_credentials auth.
 */
const IPAY_API_BASE_ENV = Deno.env.get("IPAY_API_BASE");
const IPAY_API_BASE = IPAY_API_BASE_ENV ?? "https://api.bog.ge/payments/v1";

// Warn if using old iPay URL
if (IPAY_API_BASE_ENV && IPAY_API_BASE_ENV.includes("ipay.ge")) {
  console.error(
    "WARNING: IPAY_API_BASE is set to old iPay URL. Use 'https://api.bog.ge/payments/v1' for BOG API, or remove the env var to use default."
  );
}

const IPAY_TOKEN_URL =
  Deno.env.get("IPAY_TOKEN_URL") ??
  "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token";
const IPAY_CLIENT_ID = Deno.env.get("IPAY_CLIENT_ID");
const IPAY_CLIENT_SECRET = Deno.env.get("IPAY_CLIENT_SECRET");

if (!IPAY_CLIENT_ID || !IPAY_CLIENT_SECRET) {
  throw new Error("Missing Bank of Georgia Payments credentials");
}

type OAuthToken = {
  accessToken: string;
  expiresIn: number;
  scope?: string;
};

type CachedToken = OAuthToken & { expiresAt: number };

const tokenCache: { value: CachedToken | null } = { value: null };

/**
 * Requests a new OAuth token from iPay.
 */
async function requestToken(): Promise<OAuthToken> {
  const formData = new URLSearchParams({
    grant_type: "client_credentials",
  });

  const response = await fetch(IPAY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${IPAY_CLIENT_ID}:${IPAY_CLIENT_SECRET}`)}`,
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("iPay token request failed", errorText);
    throw new Error("Unable to fetch iPay OAuth token");
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    scope: data.scope,
  };
}

/**
 * Returns a cached OAuth token or fetches a new one before expiry.
 */
export async function getOAuthToken(forceRefresh = false): Promise<OAuthToken> {
  const now = Date.now();
  if (!forceRefresh && tokenCache.value && tokenCache.value.expiresAt > now + 5000) {
    return tokenCache.value;
  }

  const freshToken = await requestToken();
  tokenCache.value = {
    ...freshToken,
    expiresAt: now + (freshToken.expiresIn - 30) * 1000,
  };

  return tokenCache.value;
}

export type IpayCreateOrderResponse = {
  id: string;
  _links?: {
    details?: { href: string };
    redirect?: { href: string };
  };
};

export type IpayPaymentDetails = {
  order_id: string;
  external_order_id?: string;
  order_status?: {
    key: string;
    value?: string;
  };
  payment_detail?: {
    code?: string;
    code_description?: string;
    transaction_id?: string;
  };
};

export type CreateOrderArgs = {
  amount: number;
  currencyCode: string;
  courseId: string;
  courseTitle: string;
  locale: string;
  redirectUrlSuccess: string;
  redirectUrlFail: string;
  callbackUrl: string;
  shopOrderId: string;
  applicationType?: "web" | "mobile";
};

/**
 * Creates an order on BOG Payments API and returns the raw payload.
 */
export async function createIpayOrder(args: CreateOrderArgs): Promise<IpayCreateOrderResponse> {
  const token = await getOAuthToken();

  // Ensure no trailing slash in base URL
  const baseUrl = IPAY_API_BASE.replace(/\/$/, "");
  const orderUrl = `${baseUrl}/ecommerce/orders`;
  
  console.log("BOG API URL:", orderUrl);
  console.log("BOG API Base (env):", IPAY_API_BASE);

  const response = await fetch(orderUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": args.locale || "ka",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      callback_url: args.callbackUrl,
      external_order_id: args.shopOrderId,
      purchase_units: {
        currency: args.currencyCode,
        total_amount: args.amount,
        basket: [
          {
            quantity: 1,
            unit_price: args.amount,
            product_id: args.courseId,
          },
        ],
      },
      redirect_urls: {
        success: args.redirectUrlSuccess,
        fail: args.redirectUrlFail,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Failed to create BOG order", {
      url: orderUrl,
      status: response.status,
      statusText: response.statusText,
      body: errorBody,
    });
    throw new Error(`BOG API error ${response.status}: ${errorBody}`);
  }

  return (await response.json()) as IpayCreateOrderResponse;
}

/**
 * Helper to extract approve/redirect link from an iPay order response.
 */
export function getApproveLink(order: IpayCreateOrderResponse): string | null {
  return order._links?.redirect?.href ?? null;
}

/**
 * Fetches payment details/receipt for an order id.
 */
export async function getPaymentDetails(orderId: string): Promise<IpayPaymentDetails> {
  const token = await getOAuthToken();
  const response = await fetch(`${IPAY_API_BASE}/receipt/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Failed to fetch payment details", errorBody);
    throw new Error("Unable to fetch payment details");
  }

  return (await response.json()) as IpayPaymentDetails;
}
