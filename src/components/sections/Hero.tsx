"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowDown } from "lucide-react";

import { editions, hero } from "@/content/site";
import { EASE } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";
import { WaveField } from "@/components/ui/WaveField";

export function Hero() {
  const reduced = useReducedMotion();
  const lines = hero.title.split("\n");

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden pb-16 pt-32">
      {/* Drawn, not photographed. `Cover` has just shown the key art full-screen,
          so repeating a crop of it here would be the third time in two screens —
          and no scrim is needed when the backdrop is dark by construction. */}
      <div className="absolute inset-0 -z-10">
        <WaveField />
        {/* The swell runs out onto the white of the section below. */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-shell" />
      </div>

      <div className="container-page relative z-10">
        <motion.p
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm"
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          <span className="size-1.5 rounded-full bg-leaf" aria-hidden />
          {hero.eyebrow}
        </motion.p>

        <h1 className="text-display max-w-2xl text-white">
          {lines.map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={{ opacity: 0, y: reduced ? 0 : 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.12, ease: EASE }}
            >
              {i === lines.length - 1 ? (
                <em className="not-italic text-sky-300">{line}</em>
              ) : (
                line
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mt-7 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
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
          <ButtonLink href={hero.secondaryCta.href} variant="ghost-light">
            {hero.secondaryCta.label}
            <ArrowDown className="size-4" aria-hidden />
          </ButtonLink>
        </motion.div>

        {/* Signposts the order the rest of the page runs in. */}
        <motion.ol
          className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/65"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
        >
          {editions.map((edition, i) => (
            <li key={edition.id} className="flex items-center gap-3">
              {i > 0 && (
                <span className="text-white/30" aria-hidden>
                  →
                </span>
              )}
              <a
                href={`#${edition.id}`}
                className={`transition-colors hover:text-white ${
                  edition.status === "upcoming" ? "text-sky-300" : ""
                }`}
              >
                {edition.name}
              </a>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
