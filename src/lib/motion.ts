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

/**
 * The one spring, for the same reason there is one `EASE`: interactions that
 * settle rather than stop. Duration-based curves are still the default for
 * entrances — this is for things a scroll or a pointer drives, where the end
 * point moves and a fixed duration would fight it.
 */
export const SPRING = { stiffness: 380, damping: 30, mass: 0.7 } as const;

/**
 * Ambient loop — weather, not an entrance. Same category as the `swell`
 * keyframe, and linear for the same reason: what it drives is a full cycle
 * sampled as keyframes, which already carries its own shape. Easing the
 * playback on top of that would make the water pulse, and `EASE` in particular
 * is a decelerating arrival curve, which reads wrong on something that never
 * arrives.
 */
export const DRIFT = {
  repeat: Infinity,
  repeatType: "loop",
  ease: "linear",
} as const;
