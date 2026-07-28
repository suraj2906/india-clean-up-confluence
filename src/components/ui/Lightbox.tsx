"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import type { GalleryVideo, Img } from "@/content/site";
import { EASE } from "@/lib/motion";
import { SmartImage } from "./SmartImage";

type Photo = Img & { caption?: string };
type Item = Photo | GalleryVideo;

const isVideo = (item: Item): item is GalleryVideo => "type" in item;
/** Alt text lives on the item itself for photos, on the poster for videos. */
const altOf = (item: Item) => (isVideo(item) ? item.poster.alt : item.alt);

export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: Item[];
  /** `null` closes the lightbox. */
  index: number | null;
  onClose: () => void;
  onIndex: (next: number) => void;
}) {
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Element that had focus before opening, so we can hand it back on close. */
  const restoreRef = useRef<Element | null>(null);
  const open = index !== null;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndex((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      // Only three controls exist in here, so keep Tab cycling among them.
      if (e.key === "Tab") {
        const focusable = document.querySelectorAll<HTMLElement>("[data-lightbox-focus]");
        if (focusable.length === 0) return;
        const list = Array.from(focusable);
        const current = list.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        const next = e.shiftKey ? current - 1 : current + 1;
        list[(next + list.length) % list.length].focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      (restoreRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose, go]);

  const item = index === null ? null : items[index];

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.caption ?? altOf(item)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-deep/95 p-4 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <button
            ref={closeRef}
            data-lightbox-focus
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X className="size-5" aria-hidden />
          </button>

          {items.length > 1 && (
            <>
              <NavButton side="left" onClick={() => go(-1)} />
              <NavButton side="right" onClick={() => go(1)} />
            </>
          )}

          <motion.figure
            key={item.src}
            className="max-h-full w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {/* Both dimensions are capped so any aspect ratio fits the viewport
                without overflowing — the caption's height is part of the budget. */}
            <div className="flex justify-center overflow-hidden rounded-2xl bg-deep-700">
              {isVideo(item) ? (
                <video
                  key={item.src}
                  src={item.src}
                  poster={item.poster.src}
                  controls
                  autoPlay
                  playsInline
                  className="h-auto max-h-[calc(100dvh-9rem)] w-auto max-w-full object-contain"
                />
              ) : (
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="h-auto max-h-[calc(100dvh-9rem)] w-auto max-w-full object-contain"
                />
              )}
            </div>
            {item.caption && (
              <figcaption className="mt-4 text-center text-sm text-white/70">
                {item.caption}
                <span className="ml-2 text-white/40">
                  {(index ?? 0) + 1} / {items.length}
                </span>
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      data-lightbox-focus
      aria-label={side === "left" ? "Previous item" : "Next item"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 ${
        side === "left" ? "left-2 sm:left-6" : "right-2 sm:right-6"
      }`}
    >
      <Icon className="size-6" aria-hidden />
    </button>
  );
}
