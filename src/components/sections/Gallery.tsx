import { gallery, gallerySection } from "@/content/site";
import { PhotoGrid } from "@/components/ui/PhotoGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** The grid itself, and why it is a uniform grid, is in `PhotoGrid`. */
export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-24 bg-shell py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow={gallerySection.eyebrow}
          title={gallerySection.title}
          intro={gallerySection.intro}
        />

        <PhotoGrid
          items={gallery}
          showMore={gallerySection.showMore}
          showLess={gallerySection.showLess}
        />
      </div>
    </section>
  );
}
