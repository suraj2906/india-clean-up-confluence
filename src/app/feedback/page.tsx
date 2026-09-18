import type { Metadata } from "next";

import { feedback, site } from "@/content/site";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Feedback",
  description: `Tell the ${site.fullName} team how ICUC 3.0 went.`,
  alternates: { canonical: "/feedback" },
  // Event-only: attendees reach it from a QR code at the venue. Kept out of
  // search, the nav and the sitemap on purpose.
  robots: { index: false, follow: false },
};

/**
 * The ICUC 3.0 feedback form, the same shell as `/register`: a page that is
 * nothing but its form. There is no `#cover-wordmark` here, so the header keeps
 * its logo throughout.
 */
export default function FeedbackPage() {
  return (
    <>
      {/* Padded for the fixed header, which is transparent at scroll position 0. */}
      <section className="bg-skywash pb-16 pt-32 sm:pb-20 sm:pt-44">
        <div className="container-page">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              {feedback.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-section max-w-2xl">{feedback.title}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {feedback.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-shell pb-24 pt-12 sm:pb-32 sm:pt-16">
        <div className="container-page mx-auto max-w-3xl">
          <Reveal>
            <FeedbackForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
