"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Film, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Img } from "@/content/site";
import { EASE } from "@/lib/motion";
import { SmartImage } from "./SmartImage";

const VIDEO_FILE = /\.(mp4|webm|ogg|mov|m4v)$/i;

/**
 * A poster tile that opens the recap film in a full-screen overlay — the way an
 * attachment previews in Gmail: dark backdrop, the film centred and large, close
 * on the ✕, on Escape, or by clicking the backdrop.
 *
 * Nothing plays until the tile is clicked — before that only the poster loads, so
 * no video bytes transfer for people who never open it (and no embed cookie for an
 * iframe player). A local file (`/videos/x.mp4`) plays in a native <video>; any
 * other value is treated as an embed URL and loaded in an <iframe>. An empty `src`
 * renders a labelled placeholder rather than an active trigger.
 */
export function VideoEmbed({
  src,
  title,
  poster,
  portrait = false,
  playLabel,
  pendingLabel,
  className = "",
}: {
  /** Local file (`/videos/x.mp4`) plays inline; any other value is an embed URL. Empty = not ready. */
  src: string;
  title: string;
  poster: Img;
  /** Frame a vertical 9:16 film instead of the default 16:9. */
  portrait?: boolean;
  playLabel: string;
  pendingLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Element focused before opening, so we can hand focus back on close. */
  const restoreRef = useRef<Element | null>(null);
  const ready = src.trim().length > 0;
  const isFile = VIDEO_FILE.test(src);

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      (restoreRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  return (
    <>
      {/* Trigger: the poster, with a play button once a film exists. */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-deep shadow-soft ${
          portrait ? "aspect-9/16" : "aspect-video"
        } ${className}`}
      >
        <SmartImage
          src={poster.src}
          alt={poster.alt}
          width={poster.width}
          height={poster.height}
          sizes="(max-width: 1024px) 100vw, 360px"
          fill
        />
        <span aria-hidden className="absolute inset-0 bg-deep/30" />

        {ready ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group absolute inset-0 grid place-items-center"
          >
            <span className="sr-only">{`${playLabel}: ${title}`}</span>
            <span
              aria-hidden
              className="grid size-16 place-items-center rounded-full bg-white/95 text-sky-700 shadow-lift transition-transform duration-300 group-hover:scale-110"
            >
              <Play className="ml-0.5 size-6 fill-current" />
            </span>
          </button>
        ) : (
          <span className="absolute inset-0 grid place-items-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
              <Film className="size-4" aria-hidden />
              {pendingLabel}
            </span>
          </span>
        )}
      </div>

      {/* Full-screen overlay player. */}
      <AnimatePresence>
        {open && ready && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-0 z-100 flex items-center justify-center bg-deep/95 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          >
            <button
              ref={closeRef}
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
            >
              <X className="size-5" aria-hidden />
            </button>

            <motion.div
              className="flex max-h-full max-w-full items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {isFile ? (
                // Both dimensions capped so any aspect ratio fits the viewport.
                <video
                  src={src}
                  title={title}
                  poster={poster.src}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[calc(100dvh-6rem)] w-auto max-w-full rounded-2xl bg-deep-700"
                />
              ) : (
                <div className="aspect-video w-[min(90vw,64rem)] overflow-hidden rounded-2xl bg-deep-700">
                  <iframe
                    src={`${src}${src.includes("?") ? "&" : "?"}autoplay=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="size-full border-0"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
