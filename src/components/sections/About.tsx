import { Recycle, Sprout, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { about } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons: Record<string, LucideIcon> = { users: Users, sprout: Sprout, recycle: Recycle };

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-shell py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow={about.eyebrow}
          title={about.title}
          intro={about.body.map((p) => (
            <p key={p.slice(0, 24)} className="mt-4 first:mt-0">
              {p}
            </p>
          ))}
        />

        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {about.pillars.map((pillar, i) => {
            const Icon = icons[pillar.icon] ?? Sprout;
            return (
              <Reveal as="li" key={pillar.title} delay={i * 0.08}>
                <div className="group h-full rounded-4xl border border-forest/8 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-leaf/30 hover:shadow-lift">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-leaf-100 text-leaf transition-colors duration-300 group-hover:bg-leaf group-hover:text-white">
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
