import { notFound } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { DriftingLitter } from "@/components/ui/DriftingLitter";
import { Reveal } from "@/components/ui/Reveal";
import { ShoreField } from "@/components/ui/ShoreField";

/**
 * The 404, dressed as the rest of the site rather than as a browser error.
 *
 * `ShoreField` and not `WaveField`: this page carries `ink` copy on `bg-skywash`,
 * which is exactly the pairing the shoreline was drawn for, and its front layer
 * is `shell` so the picture runs out into the footer instead of ending on a line.
 * Both are plain markup, so the illustration costs no client JavaScript — only
 * the reveals and the drifting litter do.
 *
 * Next has no `metadata` export on `not-found` (that is `global-not-found` only,
 * still experimental), so the tab keeps the root layout's title. Next injects the
 * `noindex` robots tag on a 404 response by itself.
 *
 * Note there is no `#cover-wordmark` on this route, which is exactly why the
 * header keeps its logo here — see the guard in `Header`.
 */
export default function NotFound() {
  return (
    // Padded for the fixed header, which is transparent at scroll position 0.
    // The bottom padding clears the tallest shoreline layer so the buttons never
    // end up standing in the water.
    <section className="bg-skywash relative isolate overflow-hidden pb-56 pt-36 sm:pt-44">
      <ShoreField />

      {/* Positions itself: it boxes to the same band `ShoreField` draws the blue
          wave in, because it has to sit on that curve rather than near it. */}
      <DriftingLitter />

      <div className="container-page relative">
        <div className="max-w-xl">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              {notFound.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="text-section">{notFound.title}</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{notFound.body}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={notFound.primaryCta.href}>{notFound.primaryCta.label}</ButtonLink>
              <ButtonLink href={notFound.secondaryCta.href} variant="ghost">
                {notFound.secondaryCta.label}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
