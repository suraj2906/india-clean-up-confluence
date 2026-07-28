"use client";

import { Expand } from "lucide-react";
import { useState } from "react";

import { gallery } from "@/content/site";
import { HoverVideo } from "@/components/ui/HoverVideo";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="gallery" className="scroll-mt-24 bg-shell py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments from the confluence"
          intro="Sessions, drives and the people who showed up."
        />

        {/* CSS columns give a masonry feel without a layout library. Every
            tile — photo or video — opens the same lightbox at its own index. */}
        <div className="mt-16 gap-5 [column-count:1] sm:[column-count:2] lg:[column-count:3]">
          {gallery.map((item, i) => (
            <Reveal key={item.src} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
              {"type" in item ? (
                <HoverVideo
                  src={item.src}
                  poster={item.poster}
                  caption={item.caption}
                  onExpand={() => setOpen(i)}
                  className="rounded-3xl"
                />
              ) : (
                <button
                  onClick={() => setOpen(i)}
                  aria-label={`Open photo: ${item.caption ?? item.alt}`}
                  className="group relative block w-full overflow-hidden rounded-3xl bg-sky-100 shadow-soft transition-shadow duration-300 hover:shadow-lift"
                >
                  <SmartImage
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-deep/85 via-deep/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="flex w-full items-center justify-between gap-3 p-5 text-left text-sm font-medium text-white">
                      {item.caption}
                      <Expand className="size-4 shrink-0" aria-hidden />
                    </span>
                  </span>
                </button>
              )}
            </Reveal>
          ))}
        </div>
      </div>

      <Lightbox items={gallery} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
