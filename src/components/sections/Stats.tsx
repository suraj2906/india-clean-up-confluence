import { stats } from "@/content/site";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Stats() {
  return (
    <section id="impact" className="relative scroll-mt-24 overflow-hidden bg-forest py-24 sm:py-32">
      {/* Concentric ripples echoing the logo — decorative only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full border border-white/5"
      >
        <div className="absolute inset-16 rounded-full border border-white/5" />
        <div className="absolute inset-32 rounded-full border border-white/5" />
      </div>

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Impact"
          title="ICUC 2.0, by the numbers"
          intro="The second edition of the confluence, held in Mumbai in September 2025."
          tone="dark"
        />

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="border-l-2 border-marigold/50 pl-5">
                <dd className="font-display text-4xl font-bold text-white sm:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-2 text-sm font-semibold text-white">{stat.label}</dt>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{stat.detail}</p>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
