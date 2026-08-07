import { carter } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";

/**
 * Full-width alternating rows rather than the card grid `Changemakers` uses.
 * A four-up grid caps a bio at about two lines; these are the people the page
 * exists for and their bios run several sentences, so each gets half a screen.
 *
 * The alternation is desktop-only on purpose. Below `lg` the grid collapses to
 * one column and every founder reads portrait-then-text in the same order —
 * flipping that on a phone would put a name above a stranger's face.
 */
export function CarterFounders() {
  return (
    <section id="founders" className="scroll-mt-24 bg-mist py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow={carter.founders.eyebrow}
          title={carter.founders.title}
          intro={carter.founders.intro}
        />

        <ul className="mt-16 space-y-16 sm:space-y-24">
          {carter.founders.people.map((person, i) => (
            <Reveal as="li" key={person.name} delay={0.05}>
              <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <div
                  // Square, because the headshots are. Capped at 28rem even on
                  // desktop: the files are ~447px, so a full half-column would
                  // upscale them. Centred in its column so the row still balances.
                  className={`relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-4xl bg-sky-100 shadow-lift lg:max-w-md ${
                    i % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <SmartImage
                    src={person.image.src}
                    alt={person.image.alt}
                    width={person.image.width}
                    height={person.image.height}
                    sizes="(max-width: 1024px) 24rem, 28rem"
                    fill
                  />
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl">{person.name}</h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
                    {person.role}
                  </p>
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-muted">
                    {person.bio.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        {/* Two of five. The others are named below so the page doesn't imply otherwise. */}
        <Reveal delay={0.1}>
          <p className="mt-16 border-t border-summit/50 pt-8 text-sm leading-relaxed text-muted">
            {carter.founders.others}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
