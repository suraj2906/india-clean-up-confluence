"use client";

import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Img } from "@/content/site";
import { Lightbox } from "./Lightbox";
import { SmartImage } from "./SmartImage";

type Photo = Img & { caption?: string };

const AUTO_ADVANCE_MS = 4500;

/** How long after the last scroll event the track counts as settled. */
const SETTLE_MS = 120;

/**
 * A one-photo-at-a-time strip that auto-advances and opens into the shared
 * lightbox on click. Scrolling is native — snap points do the work, and arrows
 * and autoplay just move the track's scroll offset. Touch swiping comes free
 * with the scroll container; there is deliberately **no mouse click-and-drag**.
 * It was tried and removed: dragging and clicking compete for the same pointer
 * on the same element, so a drag would land on one slide, open the lightbox on
 * the one it started from, and then snap back. A carousel with arrows, a
 * lightbox and autoplay does not need a fourth way to move it.
 *
 * **The loop is seamless, via cloned edges.** The track renders the last photo
 * before the first and the first photo after the last, so "next" from the final
 * slide scrolls forward into a copy of slide one rather than rewinding through
 * the whole strip. Once that scroll settles the offset is reset to the real
 * slide one with no animation — invisible, because the two are the same picture.
 * The earlier version avoided the rewind by jumping instantly instead, which is
 * why the wrap had no animation at all.
 *
 * **One consequence worth knowing:** every position fix goes through the settle
 * handler, never through the click that caused it. That is deliberate — it means
 * a drag, a trackpad flick, an arrow press and autoplay all normalise through
 * exactly one path, and the current slide is always read back from the DOM
 * rather than tracked in parallel and hoped to agree.
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
  /** Index into `photos`, always re-derived from scroll position on settle. */
  const indexRef = useRef(0);
  const reduced = useReducedMotion();

  const count = photos.length;
  const loop = count > 1;

  // [last, ...photos, first] when looping. A real index `i` therefore lives at
  // DOM position `i + 1`, and positions 0 and count+1 are the clones.
  const slides = loop ? [photos[count - 1], ...photos, photos[0]] : photos;
  const domOf = useCallback((i: number) => (loop ? i + 1 : i), [loop]);

  const scrollToDom = useCallback(
    (dom: number, smooth: boolean) => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({
        left: dom * track.clientWidth,
        behavior: smooth && !reduced ? "smooth" : "auto",
      });
    },
    [reduced],
  );

  const go = useCallback(
    (delta: number) => {
      // Deliberately not modulo'd: stepping to -1 or `count` targets a clone, and
      // the settle handler is what folds that back to the real slide.
      scrollToDom(domOf(indexRef.current) + delta, true);
    },
    [domOf, scrollToDom],
  );

  /** Park on the first real slide, and keep the offset correct across resizes. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    scrollToDom(domOf(indexRef.current), false);

    const onResize = () => scrollToDom(domOf(indexRef.current), false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [domOf, scrollToDom]);

  /**
   * The single place the current slide is decided. Runs after any scroll stops,
   * whoever caused it, so a native swipe can't leave the index stale the way it
   * used to.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let timer = 0;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!track.clientWidth) return;
        const dom = Math.round(track.scrollLeft / track.clientWidth);

        if (loop && dom === 0) {
          // Landed on the leading clone of the last photo — hop to the real one.
          indexRef.current = count - 1;
          scrollToDom(domOf(count - 1), false);
        } else if (loop && dom === count + 1) {
          indexRef.current = 0;
          scrollToDom(domOf(0), false);
        } else {
          indexRef.current = Math.min(Math.max(loop ? dom - 1 : dom, 0), count - 1);
        }
      }, SETTLE_MS);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [count, loop, domOf, scrollToDom]);

  useEffect(() => {
    if (reduced || paused || !loop) return;
    const id = setInterval(() => go(1), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [reduced, paused, loop, go]);

  if (count === 0) return null;

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
        {slides.map((photo, i) => {
          // Clones repeat a `src`, so position is the only stable key here.
          const isClone = loop && (i === 0 || i === slides.length - 1);
          const real = loop ? (i === 0 ? count - 1 : i === slides.length - 1 ? 0 : i - 1) : i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(real)}
              // The clones are the same photographs announced a second time, so
              // they are hidden from assistive tech and taken out of the tab order.
              aria-hidden={isClone || undefined}
              tabIndex={isClone ? -1 : undefined}
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
          );
        })}
      </div>

      {loop && (
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
