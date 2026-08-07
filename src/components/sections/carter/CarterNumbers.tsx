import { carter } from "@/content/site";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The dark band, built the same way as `Stats` on the landing page so the two
 * read as the same device: one for the confluence, one for the beach.
 */
export function CarterNumbers() {
  return (
    <section className="bg-deep py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow={carter.numbers.eyebrow}
          title={carter.numbers.title}
          intro={carter.numbers.intro}
          tone="dark"
        />

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {carter.numbers.facts.map((fact, i) => (
            <Reveal key={fact.label} delay={i * 0.08}>
              <div className="border-l-2 border-sky/60 pl-5">
                <dd className="font-display text-4xl font-bold text-white sm:text-5xl">
                  {/* Strings are printed as-is — `CountUp` rounds and groups its
                      digits, which is wrong for a fractional distance. */}
                  {typeof fact.value === "number" ? (
                    <CountUp value={fact.value} suffix={fact.suffix} />
                  ) : (
                    fact.value
                  )}
                </dd>
                <dt className="mt-2 text-sm font-semibold text-white">{fact.label}</dt>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{fact.detail}</p>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
