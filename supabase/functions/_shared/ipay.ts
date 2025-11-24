/**
 * Shared iPay helper utilities for Edge Functions.
 * Handles OAuth token caching and REST calls against Bank of Georgia gateways.
 */
const IPAY_API_BASE = Deno.env.get("IPAY_API_BASE") ?? "https://ipay.ge/opay/api/v1";
const IPAY_CLIENT_ID = Deno.env.get("IPAY_CLIENT_ID");
const IPAY_CLIENT_SECRET = Deno.env.get("IPAY_CLIENT_SECRET");
const IPAY_USERNAME = Deno.env.get("IPAY_USERNAME");
const IPAY_PASSWORD = Deno.env.get("IPAY_PASSWORD");
const IPAY_SCOPE = Deno.env.get("IPAY_SCOPE") ?? "payments";

if (!IPAY_CLIENT_ID || !IPAY_CLIENT_SECRET || !IPAY_USERNAME || !IPAY_PASSWORD) {
  throw new Error("Missing Bank of Georgia iPay credentials");
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
  const url = `${IPAY_API_BASE}/oauth2/token`;
  const formData = new URLSearchParams({
    grant_type: "password",
    username: IPAY_USERNAME,
    password: IPAY_PASSWORD,
    scope: IPAY_SCOPE,
  });

  const response = await fetch(url, {
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
  payment_id: string;
  order_id: string;
  payment_hash: string;
  status: string;
  status_description?: string;
  links?: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
};

export type CreateOrderArgs = {
  amount: number;
  currencyCode: string;
  courseId: string;
  courseTitle: string;
  locale: string;
  redirectUrl: string;
  callbackUrl: string;
  shopOrderId: string;
  intent?: "CAPTURE" | "AUTHORIZE";
};

/**
 * Creates an order on iPay checkout API and returns the raw payload.
 */
export async function createIpayOrder(args: CreateOrderArgs): Promise<IpayCreateOrderResponse> {
  const token = await getOAuthToken();
  const response = await fetch(`${IPAY_API_BASE}/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: args.intent ?? "CAPTURE",
      items: [
        {
          amount: args.amount.toFixed(2),
          description: args.courseTitle,
          quantity: "1",
          product_id: args.courseId,
        },
      ],
      locale: args.locale,
      shop_order_id: args.shopOrderId,
      redirect_url: args.redirectUrl,
      callback_url: args.callbackUrl,
      show_shop_order_id_on_extract: true,
      capture_method: "AUTOMATIC",
      purchase_units: [
        {
          amount: {
            currency_code: args.currencyCode,
            value: args.amount.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Failed to create iPay order", errorBody);
    throw new Error("Unable to create iPay order");
  }

  return (await response.json()) as IpayCreateOrderResponse;
}

/**
 * Helper to extract approve/redirect link from an iPay order response.
 */
export function getApproveLink(order: IpayCreateOrderResponse): string | null {
  const approve = order.links?.find((link) => link.rel.toLowerCase() === "approve");
  return approve?.href ?? null;
}

