import { ArrowRight } from "lucide-react";

import { carter } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The same band `CtaBand` puts at the foot of the landing page, with this page's
 * own ask: turn up on a Sunday, rather than bring a mission to the confluence.
 */
export function CarterCta() {
  return (
    <section className="bg-shell px-5 pb-24 sm:pb-32 md:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-4xl bg-gradient-to-br from-deep via-deep-700 to-sky-700 px-8 py-16 text-center sm:px-16 sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-sky/20 blur-3xl"
          />
          <div className="relative">
            <h2 className="text-section text-white">{carter.cta.title}</h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {carter.cta.body}
            </p>
            <div className="mt-9 flex justify-center">
              <ButtonLink href={carter.cta.button.href} className="px-8 py-3.5">
                {carter.cta.button.label}
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
