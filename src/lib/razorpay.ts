import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Server-side Razorpay, shared by the two `/api/donate/*` routes. Never import
 * this from a client component: it reads the key secret.
 *
 * The flow is Razorpay's standard Orders + Checkout one. The server creates an
 * order for the amount (so the browser can't decide what it is charged), the
 * browser opens Razorpay Checkout on that order, and the signature Checkout
 * hands back is verified here before the page says thank you. The Razorpay
 * dashboard is the record of every payment — the site keeps nothing.
 *
 * Plain `fetch` against the REST API rather than the `razorpay` package: two
 * calls don't justify a dependency.
 */

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

/** Unset keys mean donations are off, not broken — the form says so. */
export const razorpayConfigured = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

/** Carries Razorpay's HTTP status, so a rejected key pair can be told apart from an outage. */
export class RazorpayError extends Error {
  constructor(
    readonly status: number,
    body: string,
  ) {
    super(`Razorpay order failed: ${status} ${body}`);
  }
}

export async function createOrder({
  amountRupees,
  notes,
}: {
  amountRupees: number;
  notes: Record<string, string>;
}) {
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
    },
    body: JSON.stringify({
      // Razorpay counts in paise.
      amount: amountRupees * 100,
      currency: "INR",
      // At most 40 characters; only ever seen in the dashboard.
      receipt: `donate_${Date.now()}`,
      notes,
    }),
  });

  if (!res.ok) {
    throw new RazorpayError(res.status, await res.text());
  }

  const order = (await res.json()) as { id: string; amount: number; currency: string };
  return { ...order, keyId: RAZORPAY_KEY_ID as string };
}

/** Checkout's signature is HMAC-SHA256 of `order_id|payment_id` under the key secret. */
export function verifySignature(orderId: string, paymentId: string, signature: string) {
  if (!RAZORPAY_KEY_SECRET) return false;
  const expected = createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Only this site's own pages may call. */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  return Boolean(origin && host && new URL(origin).host === host);
}

/**
 * Best-effort, per-instance rate limit. On serverless it slows abuse rather than
 * preventing it — which is enough here, since an order costs nothing until paid.
 */
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

export function limited(request: Request, max: number) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}

export function str(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
