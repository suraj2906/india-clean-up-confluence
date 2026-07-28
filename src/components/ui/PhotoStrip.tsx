"use client";

import { Expand } from "lucide-react";
import { useState } from "react";

import type { Img } from "@/content/site";
import { Lightbox } from "./Lightbox";
import { SmartImage } from "./SmartImage";

type Photo = Img & { caption?: string };

/**
 * A compact grid of thumbnails that opens into the shared lightbox. Used for the
 * per-edition recaps; the main <Gallery> keeps its own masonry layout.
 * Any number of photos works — the grid reflows.
 */
export function PhotoStrip({ photos, label }: { photos: Photo[]; label: string }) {
  const [open, setOpen] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</h4>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {photos.map((photo, i) => (
          <li key={photo.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo: ${photo.caption ?? photo.alt}`}
              className="group relative block aspect-4/3 w-full overflow-hidden rounded-2xl bg-sky-100"
            >
              <SmartImage
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 50vw, 220px"
                fill
                className="transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span
                aria-hidden
                className="absolute inset-0 grid place-items-center bg-deep/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <Expand className="size-5 text-white" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox items={photos} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </div>
  );
}
