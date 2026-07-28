"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowDown } from "lucide-react";

import { editions, hero } from "@/content/site";
import { EASE } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";

/**
 * The two-column hero: copy on the left, the artwork boxed on the right, over
 * the skywash and its summit/wave shapes. `Hero` is the full-bleed banner that
 * replaced it — both read the same `hero` entry in `site.ts`, so this is a
 * layout choice only. See `/classic`.
 */
export function HeroSplit() {
  const reduced = useReducedMotion();
  const lines = hero.title.split("\n");

  return (
    <section className="relative overflow-hidden bg-skywash pb-24 pt-32 sm:pb-32 sm:pt-40">
      {/* The summit, sitting far back in the haze. Decorative. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-summit/40 sm:h-56"
      >
        <path d="M0 320 420 96l260 224H0Z" fill="currentColor" />
        <path d="M560 320 900 130l280 190H560Z" fill="currentColor" opacity="0.6" />
        <path d="M1020 320 1230 168l210 152h-420Z" fill="currentColor" opacity="0.45" />
      </svg>

      {/* The wave breaking in front of it, into the section below. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full text-shell sm:h-24"
      >
        <path
          d="M0 44c180 48 360 48 540 0s360-48 540 0 240 44 360 20v56H0V44Z"
          fill="currentColor"
        />
      </svg>

      <div className="container-page relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <motion.p
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-700/15 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 backdrop-blur-sm"
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <span className="size-1.5 rounded-full bg-leaf" aria-hidden />
            {hero.eyebrow}
          </motion.p>

          <h1 className="text-display max-w-2xl">
            {lines.map((line, i) => (
              <motion.span
                key={line}
                className="block"
                initial={{ opacity: 0, y: reduced ? 0 : 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.12, ease: EASE }}
              >
                {i === lines.length - 1 ? (
                  <em className="not-italic text-sky-700">{line}</em>
                ) : (
                  line
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            initial={{ opacity: 0, y: reduced ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: reduced ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.58, ease: EASE }}
          >
            <ButtonLink href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
              <ArrowDown className="size-4" aria-hidden />
            </ButtonLink>
          </motion.div>

          {/* Signposts the order the rest of the page runs in. */}
          <motion.ol
            className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
          >
            {editions.map((edition, i) => (
              <li key={edition.id} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="text-summit" aria-hidden>
                    →
                  </span>
                )}
                <a
                  href={`#${edition.id}`}
                  className={`transition-colors hover:text-sky-700 ${
                    edition.status === "upcoming" ? "text-sky-700" : ""
                  }`}
                >
                  {edition.name}
                </a>
              </li>
            ))}
          </motion.ol>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: reduced ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: EASE }}
        >
          {/* 3:2 to match the artwork exactly — a 4:3 box would crop its sides. */}
          <div className="relative aspect-3/2 overflow-hidden rounded-4xl bg-sky-100 shadow-lift ring-1 ring-white/60">
            <SmartImage
              src={hero.image.src}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
              fill
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
