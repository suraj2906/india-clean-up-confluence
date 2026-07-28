import { Recycle, Sprout, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { confluence } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

const icons: Record<string, LucideIcon> = { users: Users, sprout: Sprout, recycle: Recycle };

/** Chapter two: the turn from one beach to a national table, and what happens there. */
export function Confluence() {
  return (
    <section id="confluence" className="scroll-mt-24 bg-mist py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              <span className="text-summit" aria-hidden>
                02
              </span>
              {confluence.eyebrow}
            </p>
            <p className="font-display text-2xl leading-snug tracking-[-0.02em] text-ink sm:text-3xl">
              {confluence.statement}
            </p>
          </div>
        </Reveal>

        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {confluence.pillars.map((pillar, i) => {
            const Icon = icons[pillar.icon] ?? Sprout;
            return (
              <Reveal as="li" key={pillar.title} delay={i * 0.08}>
                <div className="group h-full rounded-4xl border border-summit/50 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-sky/60 hover:shadow-lift">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 transition-colors duration-300 group-hover:bg-sky-700 group-hover:text-white">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.body}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
