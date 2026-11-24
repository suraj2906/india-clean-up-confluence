import { AlertCircle, Leaf } from "lucide-react";
import type { Metadata } from "next";
import QRCode from "qrcode";

import { contact, donate, site, stats, statsSection } from "@/content/site";
import { UpiPay } from "@/components/donate/UpiPay";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { upiLink } from "@/lib/upi";

export const metadata: Metadata = {
  title: "Support",
  description: `Support the ${site.fullName} and the clean-up movements behind it.`,
  alternates: { canonical: "/support" },
  // Kept out of search, the nav and the sitemap until the UPI ID is set and the
  // copy in `donate` (site.ts) has been confirmed. Drop this line when both are true.
  robots: { index: false, follow: false },
};

/**
 * The support page: the same shell as `/contact` — a skywash top, then the case
 * for giving on the left and the form on the right. The numbers are the real
 * ICUC 2.0 `stats`, read from the same array as the landing page, so the two
 * can't disagree. There is no `#cover-wordmark` here, so the header keeps its
 * logo throughout.
 *
 * Payment is UPI straight to the LLP's account (see `UpiPay`). The QR code is
 * drawn here, at build time, so the `qrcode` package stays on the server.
 */

/**
 * The QR code for the amount-less UPI link, as one SVG path in module units —
 * a run of dark modules on a row becomes a single rectangle. Drawn in
 * `currentColor`, so it takes the theme's `ink` rather than a hard-coded hex.
 */
function upiQr() {
  const { upi } = donate;
  const { modules } = QRCode.create(upiLink({ id: upi.id, payee: upi.payee, note: upi.note }), {
    errorCorrectionLevel: "M",
  });
  let path = "";
  for (let row = 0; row < modules.size; row++) {
    for (let col = 0; col < modules.size; col++) {
      if (!modules.get(row, col)) continue;
      const start = col;
      while (col + 1 < modules.size && modules.get(row, col + 1)) col++;
      path += `M${start} ${row}h${col - start + 1}v1h-${col - start + 1}z`;
    }
  }
  return { size: modules.size, path };
}
export default function SupportPage() {
  return (
    <>
      {/* Padded for the fixed header, which is transparent at scroll position 0. */}
      <section className="bg-skywash pb-20 pt-36 sm:pt-44">
        <div className="container-page">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              {donate.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-section max-w-2xl">{donate.title}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {donate.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-shell pb-24 pt-16 sm:pb-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 className="text-2xl">{donate.where.title}</h2>
            </Reveal>
            <Stagger className="mt-8 space-y-6">
              {donate.where.items.map((item) => (
                <StaggerItem key={item.title} className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <Leaf className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{item.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{item.body}</span>
                  </span>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1}>
              <div className="mt-10 border-t border-summit pt-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                  {statsSection.title}
                </h3>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <dt className="text-xs text-muted">{s.label}</dt>
                      <dd className="font-display text-2xl text-sky-700">
                        {s.value}
                        {s.suffix}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-sm leading-relaxed text-muted">{donate.tax}</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            {donate.upi.id ? (
              <UpiPay qr={upiQr()} />
            ) : (
              <p
                role="status"
                className="flex items-start gap-2.5 rounded-2xl bg-alert-100 p-5 text-sm text-ink"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-alert" aria-hidden />
                {donate.upi.notConnected.replace("{email}", contact.email)}
              </p>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
