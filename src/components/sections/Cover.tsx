"use client";

import { animate, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { cover } from "@/content/site";
import { EASE } from "@/lib/motion";
import { SmartImage } from "@/components/ui/SmartImage";

/** How long the key art holds the screen on its own before the page moves. */
const HOLD_MS = 4500;

/** How long the walk down to the hero takes. Slow on purpose: it should read as
 *  the page settling onto the hero, not as a jump cut. */
const SCROLL_S = 2.6;

/** Any of these means the reader has taken the wheel, and the intro backs off. */
const HANDOFF_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/** Circumference of the countdown ring, for the dash offset that draws it. */
const RING = 2 * Math.PI * 16;

/**
 * The ICUC 3.0 title card: the key art alone, full-bleed, ahead of the hero.
 *
 * While it holds, `data-intro` on <html> takes the header off the screen (see
 * globals.css) so nothing competes with the artwork. It comes back the instant
 * the page starts moving — minus its logo, which stays faded out for as long as
 * the key art's own wordmark sits below the header, since the artwork is already
 * carrying the mark. `Header` reads `#cover-wordmark` below to know when that is.
 *
 * This is an ordinary section in the flow, not an overlay, so with no JS at all
 * it degrades to "a big picture you scroll past" — the page underneath is never
 * gated on this component.
 *
 * The auto-scroll is the part worth being careful about, because moving someone's
 * page for them is hostile the moment it fights them. So it fires once, only from
 * a standing start at the top, never under `prefers-reduced-motion`, and it stands
 * down — mid-scroll included — as soon as the reader scrolls, taps or types. The
 * countdown rule along the bottom is there so the move is announced, not sprung.
 */
export function Cover() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const scroll = useRef<AnimationPlaybackControls | null>(null);

  // Parallax on the artwork as the card leaves: it sinks and dims rather than
  // sliding off at page speed, so the hand-off to the hero reads as the art
  // settling behind it. Purely a style binding — it must not, and does not,
  // touch the auto-scroll, the `data-intro` toggle, or the wordmark marker
  // below, which `Header` measures by rect and so has to stay untransformed.
  //
  // Declared as a plain input/output range against the section, rather than a
  // transformer function over the raw scroll offset. That form is what lets
  // Motion hand the whole thing to the compositor: a function has to be called
  // on the main thread every frame, and the result lands a frame behind the
  // scroll the browser has already painted, which reads as jitter on the one
  // element that fills the screen.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const artOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);

  // Aim at this section's own bottom edge rather than at the hero by id, so the
  // hero lands flush with the top of the viewport — `scrollIntoView` would stop
  // `scroll-padding-top` short of it and leave a strip of the card showing.
  const scrollToHero = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const target = el.getBoundingClientRect().bottom + window.scrollY;

    if (reduced) {
      window.scrollTo({ top: target, behavior: "instant" });
      return;
    }

    // Driven by hand rather than `behavior: "smooth"`, which has no duration
    // control — the native curve is over in a few hundred milliseconds.
    //
    // `behavior: "instant"` on every frame is load-bearing, not decoration. The
    // base layer sets `scroll-behavior: smooth` on <html>, so a plain scrollTo
    // here starts its own smooth scroll toward a target one pixel away, sixty
    // times a second — they trip over each other and the page sits still.
    scroll.current?.stop();
    scroll.current = animate(window.scrollY, target, {
      duration: SCROLL_S,
      ease: EASE,
      onUpdate: (y) => window.scrollTo({ top: y, behavior: "instant" }),
    });
  }, [reduced]);

  useEffect(() => {
    // Never move the page for someone who asked for less motion — for them the
    // cue at the bottom is the way down, and the site stays on screen throughout.
    if (reduced) return;
    // A reload can restore a position further down the page. Don't yank a reader
    // back up to play an intro they have already scrolled past.
    if (window.scrollY > 4) return;

    const root = document.documentElement;
    root.setAttribute("data-intro", "");

    // Run straight off the element rather than through a `motion` prop: the whole
    // decision to arm is made here from browser-only facts, so it never has to
    // become React state, and standing down can kill it mid-flight. Linear
    // because it reads as a clock — `EASE` would have it finish well before the
    // page actually moves.
    const countdown = ring.current?.animate(
      [{ strokeDashoffset: `${RING}` }, { strokeDashoffset: "0" }],
      { duration: HOLD_MS, easing: "linear", fill: "forwards" },
    );

    let timer = 0;
    const standDown = () => {
      window.clearTimeout(timer);
      countdown?.cancel();
      scroll.current?.stop();
      root.removeAttribute("data-intro");
      for (const type of HANDOFF_EVENTS) window.removeEventListener(type, standDown);
    };

    timer = window.setTimeout(() => {
      countdown?.cancel();
      // The site comes back as the page starts moving, not once it lands.
      root.removeAttribute("data-intro");
      scrollToHero();
    }, HOLD_MS);

    // Left attached through the scroll itself, so a reader who reaches for the
    // wheel halfway down gets the page back immediately.
    for (const type of HANDOFF_EVENTS) {
      window.addEventListener(type, standDown, { passive: true });
    }
    return standDown;
  }, [reduced, scrollToHero]);

  return (
    <section
      ref={ref}
      aria-label="ICUC 3.0 title card"
      className="bg-skywash relative h-svh overflow-hidden"
    >
      {/* Rises out of the skywash underneath, which is the same pale palette as
          the slide — so a slow connection reads as the art developing, not as a
          blank screen. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        {/* The parallax lives on its own layer inside the entrance fade, so the
            two opacities compose instead of fighting over the same property.

            **Do not put a `scale` here.** One was added to hide a sliver of bare
            skywash the downward drift was assumed to expose along the top edge,
            but that strip is never on screen: the art travels down by 10% of the
            section's height while the section itself scrolls up by its full
            height, so the gap sits ~0.9 × that distance above the viewport and is
            clipped away. What the scale did do is crop the artwork horizontally.

            The portrait cut has no crop budget at all. Its "ICUC 3.0" wordmark
            sits inside a ~9% side margin, and on a 390×844 phone `object-cover`
            already spends 8.9% of it — so even `scale: 1.04` clips the leading
            "I", and 1.12 cut it clean off. Any zoom here has to come out of the
            artwork instead. */}
        <motion.div
          className="absolute inset-0"
          style={
            reduced
              ? undefined
              : { y: artY, opacity: artOpacity, willChange: "transform, opacity" }
          }
        >
          {/* Two cuts of the same card, picked by viewport orientation rather
              than width, since it is the shape of the screen that decides which
              one survives `object-cover`.

              Neither carries `priority`: that preloads the hidden one too, and
              sending a phone the 2 MB wide slide it will never show is worse
              than an LCP hint on a picture that then sits on screen for four
              seconds. Hidden means `display: none`, so the unused cut is never
              fetched. */}
          <div className="absolute inset-0 portrait:hidden">
            <SmartImage
              src={cover.image.src}
              alt={cover.image.alt}
              width={cover.image.width}
              height={cover.image.height}
              sizes="100vw"
              fill
            />
          </div>
          <div className="absolute inset-0 landscape:hidden">
            <SmartImage
              src={cover.imagePortrait.src}
              alt={cover.imagePortrait.alt}
              width={cover.imagePortrait.width}
              height={cover.imagePortrait.height}
              sizes="100vw"
              fill
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Where the "ICUC 3.0" wordmark sits inside the key art, as a fraction of
          the card's height — mid-frame on the wide slide, near the top on the
          portrait one, which is why it tracks the same orientation split as the
          images above. Nothing is drawn: `Header` measures this line to decide
          when the header's own mark may come back (see Header.tsx). Approximate
          by nature, since `object-cover` crops differently per viewport — nudge
          the percentages if the handover starts landing early or late. */}
      <div
        id="cover-wordmark"
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[45%] h-px portrait:top-[12%]"
      />

      {/* Translucent rather than bare, because `object-cover` decides what is
          behind this pill and that changes with the viewport. */}
      <motion.button
        type="button"
        onClick={scrollToHero}
        className="absolute inset-x-0 bottom-8 mx-auto inline-flex w-fit items-center gap-2.5 rounded-full bg-shell/75 py-2.5 pl-5 pr-3 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 backdrop-blur-sm transition-colors hover:bg-shell"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.3, ease: EASE }}
      >
        {cover.skip}
        {/* The ring closing around the chevron is what says "this is going to
            move on its own shortly" — without it the hold just looks stuck. */}
        <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
          <svg viewBox="0 0 36 36" aria-hidden className="absolute inset-0 size-full -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" className="stroke-sky-700/25" />
            <circle
              ref={ring}
              cx="18"
              cy="18"
              r="16"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className="stroke-sky-700"
              strokeDasharray={RING}
              strokeDashoffset={RING}
            />
          </svg>
          <ChevronDown className="size-3.5" aria-hidden />
        </span>
      </motion.button>
    </section>
  );
}
