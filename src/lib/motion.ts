import type { Variants } from "motion/react";

/** Shared easing for everything that moves. Decelerating, never bouncy. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade + rise. Pair with `viewport={VIEWPORT}` for scroll reveals. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Reduced-motion twin of `riseIn` — same states, no translation. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

/** Parent variant that walks its children in one after another. */
export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export const VIEWPORT = { once: true, amount: 0.2 } as const;
