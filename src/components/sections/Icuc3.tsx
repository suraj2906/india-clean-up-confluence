import { gallerySection, icuc3 } from "@/content/site";
import { PhotoGrid } from "@/components/ui/PhotoGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * ICUC 3.0 at length, straight after the editions timeline: the timeline names
 * it in one card, this is where its photographs live. The grid is the gallery's
 * own (`PhotoGrid`), so "Show more" and the lightbox behave identically.
 *
 * `bg-mist` rather than `bg-shell` so it reads as its own band between
 * `Editions` and the deep `Stats` band, not as more of the timeline.
 */
export function Icuc3() {
  return (
    <section id="icuc-3" className="scroll-mt-24 bg-mist py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow={icuc3.eyebrow} title={icuc3.title} intro={icuc3.intro} />

        {icuc3.photos.length > 0 ? (
          <PhotoGrid
            items={icuc3.photos}
            showMore={gallerySection.showMore}
            showLess={gallerySection.showLess}
          />
        ) : (
          <Reveal>
            <p className="mt-10 text-sm text-muted">{icuc3.pending}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
