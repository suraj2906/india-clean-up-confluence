import { stats, statsSection } from "@/content/site";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Stats() {
  return (
    <section id="impact" className="relative scroll-mt-24 overflow-hidden bg-deep py-24 sm:py-32">
      {/* Wave crests, echoing the mark — decorative only. */}
      <svg
        aria-hidden
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -right-24 -top-10 h-72 w-[40rem] text-white/5"
      >
        <g fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round">
          <path d="M0 40c60-48 120-48 180 0s120 48 180 0 120-48 180 0" />
          <path d="M0 100c60-48 120-48 180 0s120 48 180 0 120-48 180 0" />
          <path d="M0 160c60-48 120-48 180 0s120 48 180 0 120-48 180 0" />
        </g>
      </svg>

      <div className="container-page relative">
        <SectionHeading
          eyebrow={statsSection.eyebrow}
          title={statsSection.title}
          intro={statsSection.intro}
          tone="dark"
        />

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="border-l-2 border-sky/60 pl-5">
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
