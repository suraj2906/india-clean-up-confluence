import { donate } from "@/content/site";
import { createOrder, limited, RazorpayError, razorpayConfigured, sameOrigin, str } from "@/lib/razorpay";

/**
 * Creates the Razorpay order `DonateForm` opens Checkout on. The amount is
 * re-validated here against the same limits the form uses, because this is the
 * figure the donor is actually charged.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!razorpayConfigured) {
    return Response.json({ success: false, message: "not_configured" }, { status: 503 });
  }
  if (!sameOrigin(request)) {
    return Response.json({ success: false, message: "Forbidden." }, { status: 403 });
  }
  if (limited(request, 10)) {
    return Response.json({ success: false, message: "Too many requests." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return bad();

  const amount = Number(body.amount);
  const name = str(body.name, 80);
  const email = str(body.email, 254);
  const phone = str(body.phone, 20);
  const { min, max } = donate.form;

  if (!Number.isInteger(amount) || amount < min || amount > max) return bad();
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad();

  try {
    // Notes are what the dashboard shows beside the payment, so whoever reads
    // it knows who gave without cross-referencing anything.
    const order = await createOrder({ amountRupees: amount, notes: { name, email, phone } });
    return Response.json({ success: true, ...order });
  } catch (error) {
    console.error(error);
    // Razorpay refused the key pair: a mismatched or revoked ID/secret, not an outage.
    if (error instanceof RazorpayError && error.status === 401) {
      return Response.json({ success: false, message: "Payment gateway rejected our keys." }, { status: 401 });
    }
    return Response.json({ success: false, message: "Couldn't create the order." }, { status: 502 });
  }
}

function bad() {
  return Response.json({ success: false, message: "Invalid request." }, { status: 400 });
}
