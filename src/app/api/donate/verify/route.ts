import { limited, sameOrigin, str, verifySignature } from "@/lib/razorpay";

/**
 * Confirms the payment Checkout reports is genuine before `DonateForm` says
 * thank you. This only decides what the page shows — the money has already
 * moved, and the Razorpay dashboard is the record either way.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ success: false }, { status: 403 });
  }
  if (limited(request, 20)) {
    return Response.json({ success: false }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const orderId = str(body?.orderId, 64);
  const paymentId = str(body?.paymentId, 64);
  const signature = str(body?.signature, 128);

  if (!orderId || !paymentId || !signature || !verifySignature(orderId, paymentId, signature)) {
    return Response.json({ success: false }, { status: 400 });
  }
  return Response.json({ success: true });
}
