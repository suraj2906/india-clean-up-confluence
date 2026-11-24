/**
 * The standard UPI payment link (NPCI's `upi://pay` deep link). The same query
 * string works behind every scheme: `upi://pay` hands it to whichever UPI app
 * the phone's chooser picks, and `gpay://upi/pay`, `phonepe://pay` and friends
 * open one app directly, which is what an iPhone needs.
 *
 * Client-safe on purpose — the QR code is drawn on the server from this same
 * link, so `qrcode` never reaches the browser bundle.
 */
export function upiLink({
  scheme = "upi://pay",
  id,
  payee,
  note,
  amount,
}: {
  scheme?: string;
  id: string;
  payee: string;
  note: string;
  /** Rupees. Left out, the payer types the amount in their app. */
  amount?: number;
}) {
  const params = new URLSearchParams({ pa: id, pn: payee, cu: "INR", tn: note });
  if (amount) params.set("am", amount.toFixed(2));
  // UPI apps read `%20`, not `+`, as a space, and some don't decode `%40` back
  // to the `@` in a UPI ID.
  return `${scheme}?${params.toString().replace(/\+/g, "%20").replace(/%40/g, "@")}`;
}
