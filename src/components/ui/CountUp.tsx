"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const format = (n: number) => Math.round(n).toLocaleString("en-IN");

/**
 * Counts from 0 to `value` the first time it scrolls into view.
 * Under reduced motion it simply renders the final number.
 *
 * Driven straight onto the node rather than through state: a counter is a stream
 * of throwaway values, and putting each one through React means a render per
 * frame per stat for the length of the run. This is the same imperative
 * `animate()` the cover intro uses, for the same reason.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1600,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;
    const el = number.current;
    if (!el) return;

    const controls = animate(0, value, {
      duration: duration / 1000,
      // Fast off the mark, settles gently on the final number.
      ease: "easeOut",
      onUpdate: (n) => {
        el.textContent = format(n);
      },
      // Guards against the run ending a rounding step short of the real figure.
      onComplete: () => {
        el.textContent = format(value);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref}>
      {/* Server-rendered as the final number, so the figure is correct with no JS
          and correct for a screen reader; the effect only takes it over once it
          has decided to animate. */}
      <span ref={number}>{format(reduced || !inView ? value : 0)}</span>
      {suffix}
    </span>
  );
}
