"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { EASE, VIEWPORT } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait after the element enters view. */
  delay?: number;
  /** Distance in px the element travels upward. Ignored under reduced motion. */
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
};

/**
 * Fade-and-rise wrapper for anything that should animate in on scroll.
 * Fires once, and collapses to a plain fade when the OS asks for reduced motion.
 */
export function Reveal({ children, delay = 0, y = 24, className, as = "div" }: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: reduced ? 0.3 : 0.6, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
