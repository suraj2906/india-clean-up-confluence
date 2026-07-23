import { partners } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";

export function Partners() {
  return (
    <section id="partners" className="scroll-mt-24 bg-sand py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Partners"
          title="Built with the organisations that show up"
          intro="Collectives, corporates and civic partners who make the confluence possible."
          align="center"
        />

        <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((partner, i) => (
            <Reveal as="li" key={partner.name} delay={i * 0.06}>
              <div className="flex h-28 items-center justify-center rounded-2xl border border-forest/8 bg-white p-6 grayscale transition-all duration-300 hover:grayscale-0 hover:shadow-soft">
                <div className="relative h-full w-full">
                  <SmartImage
                    src={partner.src}
                    alt={partner.alt}
                    width={partner.width}
                    height={partner.height}
                    sizes="(max-width: 640px) 45vw, 200px"
                    fill
                    contain
                  />
                </div>
                <span className="sr-only">{partner.name}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
