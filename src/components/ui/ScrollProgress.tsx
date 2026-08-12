"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

import { SPRING } from "@/lib/motion";

/**
 * How far down the document you are, as a hairline along the bottom of the
 * header. The landing page is a long chronology and the only progress cue it
 * otherwise gives you is the scrollbar, which phones don't show.
 *
 * `useSpring` around the raw progress rather than the value itself: a trackpad
 * flick moves `scrollYProgress` in visible steps, and the bar snapping between
 * them looks broken. The spring gives it the same settle everything else has.
 */
export function ScrollProgress({ className = "" }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, SPRING);
  const reduced = useReducedMotion();

  // Nothing here conveys information the page doesn't already carry, so under
  // reduced motion it simply doesn't exist rather than jumping in steps.
  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, originX: 0 }}
      className={`absolute inset-x-0 h-0.5 bg-sky-700/70 ${className}`}
    />
  );
}
