import { movement } from "@/content/site";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";

/** Chapter one of the page's chronology: the beach clean-up ICUC grew out of. */
export function Movement() {
  return (
    <section id="movement" className="scroll-mt-24 bg-shell py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Reveal>
          <div className="relative">
            <Carousel photos={movement.carousel} slideClassName="aspect-4/3 rounded-4xl shadow-lift" />
            <span
              aria-hidden
              className="absolute -left-2 -top-6 font-display text-7xl font-bold text-summit/60 sm:-left-6 sm:text-8xl"
            >
              01
            </span>

            {/* The collective that started it all — its own mark, not a confluence partner. */}
            <div className="absolute -bottom-6 -right-4 size-20 overflow-hidden rounded-full border-4 border-shell bg-white shadow-lift sm:-right-6 sm:size-24">
              <SmartImage
                src={movement.logo.src}
                alt={movement.logo.alt}
                width={movement.logo.width}
                height={movement.logo.height}
                sizes="96px"
                fill
              />
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeading eyebrow={movement.eyebrow} title={movement.title} intro={movement.lead} />

          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
            {movement.body.map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 24)} delay={0.05 + i * 0.05}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-summit/50 pt-8">
              {movement.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="sr-only">{fact.label}</dt>
                  <dd className="font-display text-base font-bold text-ink sm:text-lg">
                    {fact.value}
                  </dd>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{fact.label}</p>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
