"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { EASE, VIEWPORT, fadeIn, riseIn, stagger } from "@/lib/motion";

type Tag = "div" | "section" | "li" | "article" | "span" | "ol" | "ul" | "dl" | "p";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: Tag;
};

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

/**
 * `Reveal` for a list: the container walks its children in one after another,
 * instead of every item carrying its own `delay={i * 0.0x}`.
 *
 * Worth having as its own primitive rather than a convention, because the manual
 * version is easy to get subtly wrong — `CarterFounders` gave every founder the
 * same delay, so a "staggered" list arrived all at once and nobody noticed. Here
 * the stagger is a property of the container and the items say nothing about
 * timing at all.
 *
 * The whole list is one viewport trigger, so items below the fold still animate:
 * once the container is in view the children run on their own clock.
 */
export function Stagger({
  children,
  className,
  as = "div",
  each = 0.07,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /** Gap between consecutive children, in seconds. */
  each?: number;
  /** Held before the first child moves. */
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={stagger(reduced ? each / 2 : each, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
}

/**
 * One child of a `Stagger`. Inherits `hidden`/`show` from the container, so it
 * needs no `initial`, no `whileInView` and no delay of its own.
 */
export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  // Same swap `Reveal` makes: identical states, no translation.
  return (
    <Tag className={className} variants={reduced ? fadeIn : riseIn}>
      {children}
    </Tag>
  );
}
