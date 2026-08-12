"use client";

import { Expand } from "lucide-react";
import { useState } from "react";

import { gallery, gallerySection } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { HoverVideo } from "@/components/ui/HoverVideo";
import { Lightbox } from "@/components/ui/Lightbox";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";

/**
 * How many tiles are on screen before the reader has to ask for more. Twelve
 * fills three full rows at the widest breakpoint and six at the narrowest, so
 * the section ends on a straight edge either way rather than a half-empty row.
 */
const FIRST_BATCH = 12;

/**
 * The tiles are a **uniform grid**, not masonry.
 *
 * The previous layout used CSS `column-count`, which fills the first column top
 * to bottom before starting the second — so at this many photos, item 2 sat
 * underneath item 1 on the far left and reading order fell apart. A grid lays
 * out left to right, which is the order the day happened in and the order
 * `site.ts` stores.
 *
 * Equal 4:3 cells also do the real work of making a large set look curated
 * rather than dumped: it is the ragged rhythm of masonry, not the number of
 * photos, that reads as clutter once there are twenty of them. The cost is that
 * thumbnails crop — which is why every tile opens the lightbox, where the photo
 * is shown whole and uncropped.
 *
 * `sizes` must track the column count. At two columns on a phone each tile is
 * about half the viewport; asking for `100vw` there fetches an image twice as
 * wide as any slot it can land in.
 */
export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(FIRST_BATCH);

  const expanded = shown >= gallery.length;
  const visible = gallery.slice(0, shown);
  const remaining = gallery.length - shown;

  return (
    <section id="gallery" className="scroll-mt-24 bg-shell py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow={gallerySection.eyebrow}
          title={gallerySection.title}
          intro={gallerySection.intro}
        />

        {/* Keyed on `shown` so each batch is a fresh stagger: the tiles revealed
            by "Show more" animate in on their own clock instead of appearing
            fully formed while the first twelve sit still. */}
        <Stagger
          key={shown}
          as="ul"
          each={0.04}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
        >
          {visible.map((item, i) => (
            <StaggerItem as="li" key={item.src} className="relative aspect-4/3">
              {"type" in item ? (
                // `h-full`, never `absolute inset-0`: `HoverVideo`'s button is
                // already `relative` (it anchors the clip, the badge and the
                // caption overlay), and Tailwind emits `.relative` after
                // `.absolute`, so passing `absolute` here loses the cascade no
                // matter which order the classes are written in. The button then
                // stays in flow with nothing but `fill` children to give it
                // height, and the tile collapses to nothing.
                <HoverVideo
                  src={item.src}
                  poster={item.poster}
                  caption={item.caption}
                  onExpand={() => setOpen(i)}
                  className="h-full rounded-2xl sm:rounded-3xl"
                />
              ) : (
                <button
                  onClick={() => setOpen(i)}
                  aria-label={`Open photo: ${item.caption ?? item.alt}`}
                  className="group absolute inset-0 overflow-hidden rounded-2xl bg-sky-100 shadow-soft transition-shadow duration-300 hover:shadow-lift sm:rounded-3xl"
                >
                  <SmartImage
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    fill
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* Most photographs carry no caption (see the note in
                      `site.ts`), so the overlay is mainly the click-to-expand
                      affordance. `justify-end` when there is no text keeps the
                      icon from floating alone at the left edge of the tile. */}
                  <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-deep/85 via-deep/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span
                      className={`flex w-full items-center gap-2 p-4 text-left text-xs font-medium leading-snug text-white sm:text-sm ${
                        item.caption ? "justify-between" : "justify-end"
                      }`}
                    >
                      {item.caption}
                      <Expand className="size-4 shrink-0" aria-hidden />
                    </span>
                  </span>
                </button>
              )}
            </StaggerItem>
          ))}
        </Stagger>

        {gallery.length > FIRST_BATCH && (
          <div className="mt-10 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setShown(expanded ? FIRST_BATCH : gallery.length)}
            >
              {expanded
                ? gallerySection.showLess
                : gallerySection.showMore.replace("{n}", String(remaining))}
            </Button>
          </div>
        )}
      </div>

      {/* The lightbox gets the **whole** list, not the visible slice — the arrow
          keys and swipe walk all of it, and an item's index stays the same
          whether or not the grid happens to be expanded. */}
      <Lightbox items={gallery} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
