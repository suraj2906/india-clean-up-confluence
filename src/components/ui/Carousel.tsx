"use client";

import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Img } from "@/content/site";
import { Lightbox } from "./Lightbox";
import { SmartImage } from "./SmartImage";

type Photo = Img & { caption?: string };

const AUTO_ADVANCE_MS = 4500;

/**
 * A one-photo-at-a-time strip that auto-advances and opens into the shared
 * lightbox on click. Scrolling is native (snap points), so arrows and
 * autoplay both just move the track to the next slide's offset.
 */
export function Carousel({
  photos,
  label,
  slideClassName = "aspect-4/3 rounded-3xl",
}: {
  photos: Photo[];
  label?: string;
  /** Aspect ratio + corner radius for each slide — match whatever box this replaces. */
  slideClassName?: string;
}) {
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const reduced = useReducedMotion();

  const go = useCallback(
    (delta: number) => {
      const current = indexRef.current;
      const next = (current + delta + photos.length) % photos.length;
      // Wrapping from the last slide to the first (or back) jumps instantly
      // instead of scrolling backward through every slide in between.
      const wraps = Math.abs(next - current) !== 1;
      trackRef.current?.scrollTo({
        left: next * trackRef.current.clientWidth,
        behavior: wraps ? "auto" : "smooth",
      });
      indexRef.current = next;
    },
    [photos.length],
  );

  useEffect(() => {
    if (reduced || paused || photos.length <= 1) return;
    const id = setInterval(() => go(1), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [reduced, paused, photos.length, go]);

  if (photos.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {label && (
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</h3>
      )}

      <div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setLightbox(i)}
            aria-label={`Open photo: ${photo.caption ?? photo.alt}`}
            className={`group relative w-full shrink-0 snap-start overflow-hidden bg-sky-100 ${slideClassName}`}
          >
            <SmartImage
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1024px) 100vw, 50vw"
              fill
            />
            <span
              aria-hidden
              className="absolute inset-0 grid place-items-center bg-deep/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              <Expand className="size-6 text-white" />
            </span>
          </button>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-sky-700 shadow-soft backdrop-blur transition hover:bg-white sm:left-4"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-sky-700 shadow-soft backdrop-blur transition hover:bg-white sm:right-4"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </>
      )}

      <Lightbox items={photos} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
    </div>
  );
}
