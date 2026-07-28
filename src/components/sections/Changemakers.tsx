import { changemakers } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";

export function Changemakers() {
  return (
    <section id="changemakers" className="scroll-mt-24 bg-mist py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Changemakers"
          title="The people doing the work"
          intro="The ICUC Changemaker Awards recognise grassroots leaders whose clean-up efforts have reshaped their cities, coastlines and catchments."
        />

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {changemakers.map((person, i) => (
            <Reveal as="li" key={person.name} delay={i * 0.07}>
              <article className="group h-full overflow-hidden rounded-4xl bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="relative aspect-4/5 overflow-hidden bg-sky-100">
                  <SmartImage
                    src={person.image.src}
                    alt={person.image.alt}
                    width={person.image.width}
                    height={person.image.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    fill
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{person.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
                    {person.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{person.bio}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
