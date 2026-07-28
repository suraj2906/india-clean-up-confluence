"use client";

import { Expand, Play } from "lucide-react";
import { useRef, useState } from "react";

import type { Img } from "@/content/site";
import { SmartImage } from "./SmartImage";

/**
 * A gallery tile that plays a muted, looping clip on hover/focus as a preview,
 * and hands off to the shared lightbox (with sound and controls) on click —
 * same click-to-expand contract as every photo tile.
 */
export function HoverVideo({
  src,
  poster,
  caption,
  onExpand,
  className = "",
}: {
  src: string;
  poster: Img;
  caption?: string;
  onExpand: () => void;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    videoRef.current?.play().catch(() => {});
  };

  const pause = () => {
    setPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <button
      type="button"
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
      onClick={onExpand}
      aria-label={`Open video: ${caption ?? poster.alt}`}
      className={`group relative block w-full overflow-hidden bg-sky-100 shadow-soft transition-shadow duration-300 hover:shadow-lift ${className}`}
    >
      <SmartImage
        src={poster.src}
        alt={poster.alt}
        width={poster.width}
        height={poster.height}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`h-auto w-full transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-100"}`}
      />
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Always visible — this is what tells someone to hover in the first place. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-deep/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur"
      >
        <Play className="size-3 fill-white" />
        Video
      </span>

      <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-deep/85 via-deep/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="flex w-full items-center justify-between gap-3 p-5 text-left text-sm font-medium text-white">
          {caption}
          <Expand className="size-4 shrink-0" aria-hidden />
        </span>
      </span>
    </button>
  );
}
