"use client";

import Image from "next/image";
import { Waves } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useState } from "react";

type SmartImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Stretch to fill a positioned parent instead of flowing at intrinsic size. */
  fill?: boolean;
  /** Logos need padding and no cropping; photos should cover their box. */
  contain?: boolean;
};

/**
 * next/image with a themed fallback.
 *
 * The photo set is supplied after launch, so any `src` in `src/content/site.ts`
 * may not exist on disk yet. Rather than showing a broken image, we swap in a
 * gradient placeholder — the layout is identical either way, so dropping the real
 * file in later causes no shift.
 */
export function SmartImage({
  src,
  alt,
  width,
  height,
  className = "",
  sizes = "100vw",
  priority = false,
  fill = false,
  contain = false,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();

  // The photos arrive over the wire long after the layout does, and popping in at
  // full opacity is the one thing that makes a page of them feel unfinished.
  // `priority` images are exempt: an LCP candidate must not start invisible.
  const fades = !priority && !reduced;

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-sky-100 via-summit-100 to-leaf-100 ${
          fill ? "absolute inset-0" : ""
        } ${className}`}
        style={fill ? undefined : { aspectRatio: `${width} / ${height}` }}
      >
        <Waves className="size-8 text-sky-700/35" aria-hidden />
      </div>
    );
  }

  // Plain CSS rather than a `motion` wrapper: an extra element around every photo
  // on the site would change how `fill` and `object-cover` resolve. The curve is
  // `EASE` written out, since a class name can't read a TS constant.
  const fade = fades
    ? `transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        loaded ? "opacity-100" : "opacity-0"
      }`
    : "";

  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      // `onLoad` does not fire for an image the browser already had decoded by the
      // time React attached the handler — a cached photo, or a second visit. That
      // would strand it at `opacity-0`, so the element is asked directly.
      ref={(el) => {
        if (el?.complete) setLoaded(true);
      }}
      {...(fill
        ? {
            fill: true,
            className: `${contain ? "object-contain" : "object-cover"} ${fade} ${className}`,
          }
        : { width, height, className: `${fade} ${className}` })}
    />
  );
}
