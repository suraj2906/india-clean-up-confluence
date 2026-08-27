import type { Metadata } from "next";

import { registration, site } from "@/content/site";
import { RegistrationForm } from "@/components/register/RegistrationForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Register",
  description: `Register for ${site.fullName} 3.0 — open to volunteers, clean-up movements, corporates, students and press. NGOs can also apply to pitch at One Mentor, Many Missions.`,
  alternates: { canonical: "/register" },
};

/**
 * Registration is one form for everyone, and the page is nothing but that form.
 *
 * The One Mentor, Many Missions explanation used to be a section under it. It is
 * now inside the form, unfolding when the dropdown says NGO — nobody scrolls
 * past a form they came to fill in, so an explainer below it was an explainer
 * nobody read. Don't put it back down here: two copies of the same pitch is how
 * they end up disagreeing with each other.
 *
 * There is no `#cover-wordmark` on this route, so the header keeps its logo
 * here — same as `/contact`.
 */
export default function RegisterPage() {
  return (
    <>
      {/* Padded for the fixed header, which is transparent at scroll position 0. */}
      <section className="bg-skywash pb-20 pt-36 sm:pt-44">
        <div className="container-page">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              {registration.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-section max-w-2xl">{registration.title}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {registration.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-shell pb-24 pt-16 sm:pb-32">
        <div className="container-page mx-auto max-w-3xl">
          <Reveal>
            <RegistrationForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
