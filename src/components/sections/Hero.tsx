"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowDown } from "lucide-react";

import { hero } from "@/content/site";
import { EASE } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";

export function Hero() {
  const reduced = useReducedMotion();
  const words = hero.title.split("\n");

  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-forest">
      {/* Backdrop photo, slowly settling from a slight zoom. */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: reduced ? 1 : 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0.5 : 1.6, ease: EASE }}
      >
        <SmartImage
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.width}
          height={hero.image.height}
          sizes="100vw"
          priority
          fill
        />
      </motion.div>

      {/* Two overlays: a vertical one for text legibility, a green one for warmth. */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/70 to-forest/25" />
      <div className="absolute inset-0 bg-forest/25 mix-blend-multiply" />

      <div className="container-page relative z-10 pb-20 pt-32 sm:pb-28">
        <motion.p
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm"
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        >
          <span className="size-1.5 rounded-full bg-marigold" aria-hidden />
          {hero.eyebrow}
        </motion.p>

        <h1 className="text-display max-w-4xl text-white">
          {words.map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={{ opacity: 0, y: reduced ? 0 : 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease: EASE }}
            >
              {i === words.length - 1 ? <em className="not-italic text-marigold">{line}</em> : line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mt-7 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
        >
          <ButtonLink href={hero.primaryCta.href}>
            {hero.primaryCta.label}
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink
            href={hero.secondaryCta.href}
            variant="ghost"
            className="border-white/30 text-white hover:border-white/60 hover:bg-white/10"
          >
            {hero.secondaryCta.label}
            <ArrowDown className="size-4" aria-hidden />
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
