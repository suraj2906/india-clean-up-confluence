import { ArrowRight } from "lucide-react";

import { carter, movement } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ShoreField } from "@/components/ui/ShoreField";
import { SmartImage } from "@/components/ui/SmartImage";

/**
 * The page top. Padded for the fixed header, which is transparent at scroll
 * position 0 — same allowance the contact page makes.
 *
 * The Carter mark leads, rather than sitting in a corner the way it does on the
 * landing page's `Movement`: here the movement is the subject, not a footnote.
 *
 * `ShoreField` draws the beach and its mangroves along the foot of the band —
 * this is the page about a shoreline, and a flat wash was the one thing on the
 * site that said nothing about its subject.
 *
 * The section is held to the viewport height (`min-h-svh`, the small-viewport
 * unit, so a phone's retracting address bar can't push the beach off screen)
 * with the copy centred in what's left above it. That is deliberate: the whole
 * point of the illustration is that it is on screen when the page loads, and
 * anchoring the water to the bottom of a naturally-sized section put it below
 * the fold on a laptop. The bottom padding clears the tallest wave layer
 * (`h-40`) so the water has a band of its own and never runs up behind the
 * buttons; `overflow-hidden` stops the swell's double-width layers from
 * widening the page.
 */
export function CarterHero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-skywash pb-44 pt-32 sm:pt-36">
      {/* No `-z-10` here: the section is `relative` with an auto z-index, which
          is not a stacking context, so a negative-z child escapes to the root
          and paints *behind* `bg-skywash`. Plain source order does the job —
          `ShoreField` is already absolute, and the content below is `relative`,
          so it stacks on top. */}
      <ShoreField />

      <div className="container-page relative">
        <Reveal>
          <div className="relative size-20 overflow-hidden rounded-full border-4 border-shell bg-white shadow-lift sm:size-28">
            <SmartImage
              src={movement.logo.src}
              alt={movement.logo.alt}
              width={movement.logo.width}
              height={movement.logo.height}
              sizes="112px"
              fill
            />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            {carter.hero.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="text-display">{carter.hero.title}</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {carter.hero.lead}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={carter.hero.cta.href} className="px-8 py-3.5">
              {carter.hero.cta.label}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>

            {/* A plain anchor, not `ButtonLink` — that wraps next/link, which has
                nowhere to put target/rel for an off-site destination. No brand
                icon: lucide-react no longer ships one, and the socials on the
                contact page are text-only too. */}
            <a
              href={carter.hero.instagram.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-700/25 px-6 py-3 text-sm font-semibold text-sky-700 transition-all duration-300 ease-out hover:border-sky-700/60 hover:bg-sky-50"
            >
              {carter.hero.instagram.label}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
