import { ArrowRight } from "lucide-react";

import { cta } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CtaBand() {
  return (
    <section className="bg-shell px-5 pb-24 sm:pb-32 md:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-4xl bg-gradient-to-br from-forest via-forest-700 to-ocean px-8 py-16 text-center sm:px-16 sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-marigold/10 blur-3xl"
          />
          <div className="relative">
            <h2 className="text-section text-white">{cta.title}</h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {cta.body}
            </p>
            <div className="mt-9 flex justify-center">
              <ButtonLink href={cta.button.href} className="px-8 py-3.5">
                {cta.button.label}
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
