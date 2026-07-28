"use client";

import Image from "next/image";
import { Waves } from "lucide-react";
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

  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      {...(fill
        ? { fill: true, className: `${contain ? "object-contain" : "object-cover"} ${className}` }
        : { width, height, className })}
    />
  );
}
