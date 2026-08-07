import { Award } from "lucide-react";

import { carter } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** The origin story at full length — the version `Movement` only has room to summarise. */
export function CarterStory() {
  return (
    <section className="bg-shell py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow={carter.story.eyebrow} title={carter.story.title} />

        <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
          {carter.story.body.map((paragraph, i) => (
            <Reveal key={paragraph.slice(0, 24)} delay={0.05 + i * 0.05}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 max-w-2xl border-t border-summit/50 pt-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {carter.story.recognitionLabel}
            </h3>
            <ul className="mt-4 space-y-3">
              {carter.story.recognition.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                  <Award className="mt-0.5 size-4 shrink-0 text-sky-700" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
