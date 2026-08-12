"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * The rail behind the editions list, drawn as you read down it.
 *
 * `Editions` stays a server component — this is the one client leaf it composes,
 * which is the same arrangement every other section uses. It replaces what was a
 * static gradient span; the gradient is still there underneath at low opacity, so
 * the full height of the chronology is always visible and the bright rail is the
 * part that fills in. Without the track the list would look truncated.
 *
 * The offsets track the rail against the middle of the viewport rather than its
 * edges, so the line is at the edition you are actually reading rather than one
 * screen ahead of it.
 */
export function TimelineRail({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  // Starts as a visible stub rather than at zero: a rail of length nothing reads
  // as a missing element, not as an empty one.
  const scaleY = useTransform(scrollYProgress, [0, 1], [0.02, 1]);

  return (
    <span ref={ref} aria-hidden className={`absolute w-0.5 ${className}`}>
      <span className="absolute inset-0 bg-summit" />
      <motion.span
        className="absolute inset-0 origin-top bg-gradient-to-b from-sky via-sky/60 to-leaf"
        style={reduced ? undefined : { scaleY }}
      />
    </span>
  );
}
