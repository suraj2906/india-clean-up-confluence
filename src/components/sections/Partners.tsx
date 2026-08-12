import { partners } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";

/**
 * The logo row, last thing before `CtaBand` asks the reader to get in touch —
 * the argument that the confluence is something organisations already back, made
 * immediately before the ask.
 *
 * One continuously scrolling row rather than a grid. The track holds the list
 * twice and walks left by exactly half its width (`--animate-marquee`), so the
 * moment the first copy leaves the frame the second is sitting where it started
 * and the loop is invisible. Nothing here is interactive, so no `"use client"` —
 * it is markup and a CSS animation.
 *
 * Every entry keeps its name in text under the logo. Partly because a wordmark at
 * 56px is not always readable, partly because it is the only thing identifying an
 * entry if its file ever goes missing and `SmartImage` falls back.
 *
 * `contain` on the image, not `cover`: these are marks of wildly different
 * proportions, and cropping a logo to fill a box is how you end up publishing
 * half of somebody's trademark.
 */

/** Seconds per full pass. Long enough to read a logo as it goes by. */
const DURATION = "48s";

/**
 * The heading is overridable because `/carter-clean-up` runs the same row: the
 * list of organisations is genuinely the same one, but "Who backs the confluence"
 * is the wrong sentence on the movement's own page. Copy for both framings lives
 * in `site.ts` (`partners` and `carter.partners`) — never inline here.
 */
export function Partners({
  eyebrow = partners.eyebrow,
  title = partners.title,
  intro = partners.intro,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
} = {}) {
  return (
    <section className="overflow-hidden bg-mist py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
      </div>

      <Reveal className="mt-14">
        {/* The mask feathers both ends so logos dissolve instead of being
            guillotined at the edge of the viewport. Full-bleed on purpose —
            a conveyor that stops at the container gutter looks like a bug. */}
        <div
          className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          {/* The trailing padding must equal the gap, at every breakpoint. The
              -50% shift only lands cleanly if the two copies are the same width,
              and the gap between the last item of one copy and the first of the
              next is only balanced by an equal pad at the very end. Change
              `gap-12` and you must change `pr-12` with it, or the loop jolts. */}
          <ul
            className="animate-marquee flex w-max items-start gap-12 pr-12 group-hover:[animation-play-state:paused] sm:gap-20 sm:pr-20"
            style={{ animationDuration: DURATION }}
          >
            {/* Two passes of the same list. The second is `aria-hidden` so the
                row is announced once, not twice. */}
            {[0, 1].map((copy) =>
              partners.items.map((item) => (
                <li
                  key={`${copy}-${item.name}`}
                  aria-hidden={copy === 1 || undefined}
                  className="flex w-40 shrink-0 flex-col items-center text-center sm:w-48"
                >
                  {/* Fixed box so every logo lands on the same baseline whatever
                      its proportions, and the names below stay on one line. */}
                  <div className="relative h-14 w-full sm:h-16">
                    <SmartImage
                      src={item.image.src}
                      alt={item.image.alt}
                      width={item.image.width}
                      height={item.image.height}
                      sizes="192px"
                      fill
                      contain
                    />
                  </div>
                  <p className="mt-5 text-sm font-semibold leading-snug text-ink">{item.name}</p>
                  <p className="mt-1.5 text-xs leading-snug text-muted">{item.note}</p>
                </li>
              )),
            )}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
