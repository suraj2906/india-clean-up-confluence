import { carter, movement } from "@/content/site";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The same photo set the landing page's `Movement` carousel shows — deliberately
 * not a second array. A picture dropped into `movement.carousel` appears in both
 * places, and there is only ever one list of Carter photos to keep current.
 */
export function CarterPhotos() {
  return (
    <section className="bg-shell py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow={carter.photos.eyebrow} title={carter.photos.title} />

        <Reveal delay={0.1}>
          <div className="mt-12">
            <Carousel
              photos={movement.carousel}
              slideClassName="aspect-4/3 rounded-3xl shadow-lift sm:rounded-4xl"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
