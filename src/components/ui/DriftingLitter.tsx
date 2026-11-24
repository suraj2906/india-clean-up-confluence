"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  SHORE_LAYER_PX,
  SHORE_TRAVEL,
  bobSeconds,
  surfaceAmpPx,
  surfaceMidPx,
  wavePhaseAt,
} from "@/lib/waves";

/**
 * A scatter of litter riding the blue wave on the 404, every piece of which can
 * be swept up.
 *
 * Drawn rather than photographed, in the same flat `currentColor` silhouette
 * language as the mangroves in `ShoreField` — they share a frame, so a detailed
 * bottle next to a two-tone tree would read as a mistake. The group is
 * `aria-hidden`: it is a picture with a joke in it, and nothing on the page
 * depends on finding the joke.
 *
 * **It rides one specific wave.** Every piece floats on `ShoreField`'s `sea`
 * band — the big pale-blue one, whose crest is the topmost waterline — and this
 * component's whole job is to sit on that curve rather than near it:
 *
 * - The container is boxed to exactly that band (`inset-x-0 bottom-0` at the
 *   band's height), so both share one coordinate space.
 * - Each piece's resting height is the band's waterline, and it rises and falls
 *   by the band's real amplitude — `surfaceMidPx` / `surfaceAmpPx` off the same
 *   curve `ShoreField` draws. Every piece sits at the same base height, because
 *   they are all on the same water; what separates them is where the wave is.
 * - Each piece is placed at a *fraction* of the band's width, which is what makes
 *   the lock possible: `wavePhaseAt` turns that fraction into a phase offset with
 *   the viewport width cancelled out, so a static `animation-delay` holds it at
 *   every screen size. A piece is at its high point when the water under it is.
 * - The period is `bobSeconds` of the band's travel: one crest passes, one bob.
 *
 * It also travels in a circle rather than a line, because water in a wave does —
 * forward at the crest, back in the trough — which is what makes flotsam appear
 * to stay put while rising, tipping and sliding. That is in the `float` keyframe.
 *
 * And because a piece rides the wave rather than crossing it, the surface sits at
 * a *fixed* height relative to the piece — so "which part of this is underwater"
 * is a constant, and each drawing can be split once, statically, into a bright
 * half above the line and a faint half below it. That is the whole submersion
 * effect; nothing has to track anything per frame.
 *
 * CSS and not Motion, like the waves themselves: ambient weather that never ends
 * belongs on the compositor next to the thing it rides, and the global
 * `prefers-reduced-motion` block in `globals.css` parks it with no branch here.
 */

/** The band the litter floats on. Everything below is derived from this. */
const BAND = "sea" as const;
const BAND_PX = SHORE_LAYER_PX[BAND];
const REST_PX = surfaceMidPx(BAND_PX);
const BOB_PX = surfaceAmpPx(BAND_PX);
const PERIOD_S = bobSeconds(SHORE_TRAVEL[BAND]);

/** How long the broom is on screen. Must match `--animate-sweep`'s duration. */
const SWEEP_MS = 850;

/**
 * How far a piece swings and tips. The bob is the water's, so it is not a taste
 * decision; these two are. A shore wave's orbit is flattened, so the sway stays
 * well under the bob, and the tilt is eyeballed against the surface slope at a
 * desktop width — the real slope steepens as the viewport narrows, so on a phone
 * the litter tips slightly less than the water it sits on.
 */
const SWAY_PX = 9;
const TILT_DEG = 12;

/** How much of the drawing still shows once it is under the surface. */
const SUBMERGED_OPACITY = 0.4;

type Piece = {
  key: string;
  /** Position across the band, as a fraction. Sets the wave phase. */
  at: number;
  /**
   * The breakpoint a piece first appears at. Left out, it floats at every width.
   * Positions are fractions, so the gaps between pieces shrink with the screen;
   * the extras join only once there is room for them not to overlap.
   */
  from?: "sm" | "lg" | "xl";
  /** Rendered size in px. */
  w: number;
  h: number;
  /** viewBox as [minX, minY, width, height]. */
  box: [number, number, number, number];
  /** The y, in viewBox units, that the water surface cuts the piece at. */
  waterline: number;
  draw: ReactNode;
};

/**
 * Where each piece sits, and how deep it floats.
 *
 * The positions are kept to the middle stretch — 0.27 to 0.78 — so that on a
 * wide screen the pieces stay clear of the mangrove stands anchored at both
 * edges, and spaced so `wavePhaseAt` spreads them over the whole wave: some on a
 * crest, some in a trough, the rest on the way between. That spread is a
 * consequence of the positions, not a separate dial: move a piece and its phase
 * moves with it, which is the point. Never give a piece its own timing.
 *
 * Four float at every width (the stands nearly meet on a phone), and the rest
 * join at `sm`, `lg` and `xl`. The list runs left to right, and the gaps were
 * checked at the narrowest width each piece appears at.
 *
 * `waterline` is a property of the object, not the scene — a bottle lies low and
 * takes water over most of its body, a bag or a foam tray holds air and rides
 * higher, a cigarette butt barely breaks the surface.
 */
const PIECES: Piece[] = [
  {
    key: "flipflop",
    at: 0.27,
    from: "xl",
    w: 36,
    h: 14,
    box: [-20, -8, 40, 16],
    // Foam, so it rides high.
    waterline: 3,
    draw: (
      <>
        <rect x="-18" y="-2" width="36" height="8" rx="4" fill="currentColor" />
        <path
          d="M-6,-2 C-3,-8 3,-8 7,-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    key: "straw",
    at: 0.29,
    from: "sm",
    w: 28,
    h: 11,
    box: [-16, -6, 32, 12],
    waterline: 2,
    draw: (
      <path
        d="M-14,3 L7,3 L13,-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    key: "cap",
    at: 0.325,
    from: "lg",
    w: 14,
    h: 11,
    box: [-8, -6, 16, 12],
    waterline: 2,
    draw: <rect x="-6" y="-4" width="12" height="8" rx="2" fill="currentColor" />,
  },
  {
    key: "bottle",
    at: 0.36,
    w: 52,
    h: 24,
    box: [-30, -14, 60, 28],
    waterline: 2,
    draw: (
      <>
        <rect x="-26" y="-9" width="44" height="18" rx="9" fill="currentColor" />
        <rect x="16" y="-4.5" width="10" height="9" rx="2.5" fill="currentColor" />
        <rect x="24" y="-6" width="4" height="12" rx="1.5" fill="currentColor" />
      </>
    ),
  },
  {
    key: "packet",
    at: 0.405,
    from: "lg",
    w: 30,
    h: 19,
    box: [-17, -11, 34, 22],
    waterline: 2,
    // Crimped at both ends, which is what makes it a crisp packet and not a box.
    draw: (
      <path
        d="M-15,-8 L-12,-6 L-15,-3 L-12,0 L-15,3 L-12,6 L-15,9 L15,9 L12,6 L15,3 L12,0 L15,-3 L12,-6 L15,-8 Z"
        fill="currentColor"
      />
    ),
  },
  {
    key: "can",
    at: 0.44,
    from: "sm",
    w: 30,
    h: 19,
    box: [-16, -10, 32, 20],
    // Lying on its side, half full of water.
    waterline: 0,
    draw: (
      <>
        <rect x="-12" y="-7" width="24" height="14" rx="2" fill="currentColor" />
        <rect x="-15" y="-6" width="4" height="12" rx="1.5" fill="currentColor" />
        <rect x="11" y="-6" width="4" height="12" rx="1.5" fill="currentColor" />
      </>
    ),
  },
  {
    key: "butt",
    at: 0.475,
    from: "lg",
    w: 16,
    h: 7,
    box: [-9, -4, 18, 8],
    // Barely breaks the surface.
    waterline: -1,
    draw: (
      <>
        <rect x="-8" y="-2" width="11" height="4" rx="1" fill="currentColor" />
        <rect x="4" y="-2" width="5" height="4" rx="1" fill="currentColor" />
      </>
    ),
  },
  {
    key: "wrapper",
    at: 0.52,
    w: 34,
    h: 22,
    box: [-20, -14, 40, 26],
    // Sodden, so it sits lowest of the three.
    waterline: 0,
    draw: <path d="M-18,2 L-9,-9 L-1,-3 L7,-12 L18,-4 L13,6 L2,3 L-6,10 Z" fill="currentColor" />,
  },
  {
    key: "rings",
    at: 0.56,
    from: "xl",
    w: 40,
    h: 16,
    box: [-22, -9, 44, 18],
    waterline: 1,
    // The six-pack holder: two rows of three loops.
    draw: (
      <g fill="none" stroke="currentColor" strokeWidth="2.5">
        <ellipse cx="-12" cy="-3" rx="6" ry="3.5" />
        <ellipse cx="0" cy="-3" rx="6" ry="3.5" />
        <ellipse cx="12" cy="-3" rx="6" ry="3.5" />
        <ellipse cx="-12" cy="4" rx="6" ry="3.5" />
        <ellipse cx="0" cy="4" rx="6" ry="3.5" />
        <ellipse cx="12" cy="4" rx="6" ry="3.5" />
      </g>
    ),
  },
  {
    key: "cup",
    at: 0.61,
    w: 20,
    h: 24,
    box: [-11, -14, 22, 26],
    waterline: 4,
    draw: (
      <>
        <path d="M-9,-9 L9,-9 L6,10 L-6,10 Z" fill="currentColor" />
        <rect x="-10" y="-12" width="20" height="3" rx="1.5" fill="currentColor" />
      </>
    ),
  },
  {
    key: "tray",
    at: 0.645,
    from: "lg",
    w: 36,
    h: 14,
    box: [-20, -8, 40, 16],
    // Polystyrene: almost all of it stays dry.
    waterline: 4,
    draw: <path d="M-18,-5 L18,-5 L15,6 L-15,6 Z" fill="currentColor" />,
  },
  {
    key: "bag",
    at: 0.7,
    w: 28,
    h: 26,
    box: [-16, -16, 32, 30],
    // Air trapped in it, so only the bottom of the bag goes under.
    waterline: 5,
    draw: (
      <>
        <path d="M-14,-2 L14,-2 L10,12 L-10,12 Z" fill="currentColor" />
        <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M-8,-2 C-8,-11 -3,-14 0,-14" />
          <path d="M8,-2 C8,-11 3,-14 0,-14" />
        </g>
      </>
    ),
  },
  {
    key: "net",
    at: 0.74,
    from: "xl",
    w: 36,
    h: 18,
    box: [-20, -10, 40, 20],
    waterline: 2,
    // A tangle of old fishing line.
    draw: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M-18,4 C-10,-8 -2,10 6,-2 S16,-6 18,4" />
        <path d="M-14,-4 C-6,6 2,-8 10,4 S16,8 14,-2" />
        <path d="M-10,8 C-4,0 4,0 12,8" />
      </g>
    ),
  },
  {
    key: "bottle-small",
    at: 0.775,
    from: "xl",
    w: 40,
    h: 18,
    box: [-30, -14, 60, 28],
    waterline: 3,
    draw: (
      <>
        <rect x="-26" y="-9" width="44" height="18" rx="9" fill="currentColor" />
        <rect x="16" y="-4.5" width="10" height="9" rx="2.5" fill="currentColor" />
        <rect x="24" y="-6" width="4" height="12" rx="1.5" fill="currentColor" />
      </>
    ),
  },
];

/** Tailwind needs whole class names in the source, so each breakpoint is spelled out. */
const SHOW_FROM = { sm: "hidden sm:block", lg: "hidden lg:block", xl: "hidden xl:block" } as const;

/**
 * How far down to push a piece so its own waterline lands on the water's.
 * `bottom` puts the box's bottom edge on the surface, which is what left the
 * litter sitting on top of the wave rather than in it.
 */
const sinkPx = (piece: Piece) => {
  const [, minY, , boxH] = piece.box;
  return (minY + boxH - piece.waterline) * (piece.h / boxH);
};

/** The drawing, split once at its waterline: bright above, faint below. */
function Floater({ piece }: { piece: Piece }) {
  const [minX, minY, boxW, boxH] = piece.box;
  const above = `litter-${piece.key}-above`;
  const below = `litter-${piece.key}-below`;

  return (
    <svg
      viewBox={piece.box.join(" ")}
      width={piece.w}
      height={piece.h}
      className="overflow-visible"
      aria-hidden
    >
      <defs>
        <clipPath id={above}>
          <rect x={minX} y={minY} width={boxW} height={piece.waterline - minY} />
        </clipPath>
        <clipPath id={below}>
          <rect
            x={minX}
            y={piece.waterline}
            width={boxW}
            height={minY + boxH - piece.waterline}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#${above})`}>{piece.draw}</g>
      <g clipPath={`url(#${below})`} opacity={SUBMERGED_OPACITY}>
        {piece.draw}
      </g>
    </svg>
  );
}

/**
 * The broom that clears a piece away. Drawn hanging from its own origin so the
 * `sweep` keyframe swings the head through the litter, the way a broom pivots
 * around the hand rather than around its middle.
 */
function Broom() {
  return (
    <svg
      viewBox="-12 0 24 48"
      className="animate-sweep absolute bottom-2 left-1/2 h-12 w-6 -translate-x-1/2"
      style={{ transformOrigin: "50% 0%" }}
      aria-hidden
    >
      <g stroke="currentColor" strokeLinecap="round" fill="none">
        <path d="M0,0 L0,30" strokeWidth="3" />
        {/* Splayed slightly, so the head reads as bristles rather than a bat. */}
        <path d="M-7,30 L7,30" strokeWidth="3" />
        <path d="M-7,31 L-9,44" strokeWidth="2.5" />
        <path d="M-2.5,31 L-3,45" strokeWidth="2.5" />
        <path d="M2.5,31 L3,45" strokeWidth="2.5" />
        <path d="M7,31 L9,44" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

export function DriftingLitter() {
  const [swept, setSwept] = useState<string[]>([]);
  const [sweeping, setSweeping] = useState<string[]>([]);
  // The source of truth for "already handled", so a pointer crossing a piece
  // twice in one gesture can't queue two brooms.
  const done = useRef(new Set<string>());
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const ids = timers.current;
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, []);

  const clean = useCallback((key: string) => {
    if (done.current.has(key)) return;
    done.current.add(key);
    setSwept((prev) => [...prev, key]);
    setSweeping((prev) => [...prev, key]);
    timers.current.push(
      window.setTimeout(() => setSweeping((prev) => prev.filter((k) => k !== key)), SWEEP_MS),
    );
  }, []);

  return (
    // Boxed to the `sea` band exactly, so "a fraction across" means the same
    // thing here as it does to the wave. Transparent to the pointer except for
    // the pieces; `touch-action` is what lets a swipe run across several of them
    // instead of being taken by the page as a scroll.
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 text-sky-700"
      style={{ height: BAND_PX, touchAction: "none" }}
    >
      {PIECES.map((piece) => {
        const gone = swept.includes(piece.key);
        return (
          // One element per job. Placement, orbit and sink each write their own
          // `transform`, and sharing an element would mean one silently
          // overwriting another.
          <div
            key={piece.key}
            className={`absolute -translate-x-1/2 ${piece.from ? SHOW_FROM[piece.from] : ""}`}
            style={{ left: `${piece.at * 100}%`, bottom: REST_PX }}
          >
            <div
              className="animate-float"
              style={
                {
                  animationDuration: `${PERIOD_S}s`,
                  // Negative, so the piece starts already at its point in the
                  // wave rather than waiting out the offset before it moves.
                  animationDelay: `-${(wavePhaseAt(piece.at) * PERIOD_S).toFixed(2)}s`,
                  "--bob": `${BOB_PX}px`,
                  "--sway": `${SWAY_PX}px`,
                  "--tilt": `${TILT_DEG}deg`,
                } as React.CSSProperties
              }
            >
              <div
                className="relative"
                style={{ transform: `translateY(${sinkPx(piece).toFixed(2)}px)` }}
              >
                {/* The two opacities are mutually exclusive on purpose. Listing
                    `opacity-30` in the base and `opacity-0` in the swept state
                    would put both in the class list, and which one wins is
                    decided by their order in Tailwind's stylesheet rather than
                    in this attribute — so the piece would shrink but never fade. */}
                <div
                  className={`transition-all duration-500 ease-out ${
                    gone ? "scale-30 opacity-0" : "opacity-30"
                  }`}
                >
                  <Floater piece={piece} />
                </div>

                {/* The hit target, deliberately larger than the drawing and
                    deliberately *absolute*: as a padded wrapper it sat below the
                    artwork in the box and lifted every piece a padding's worth
                    clear of the water it was supposed to be sitting in. Hover
                    clears it on a mouse; pointerdown covers a tap, and releasing
                    the implicit touch capture lets a swipe go on to clear
                    whatever else it crosses. */}
                {!gone && (
                  <span
                    className="pointer-events-auto absolute -inset-3 cursor-pointer"
                    onPointerEnter={() => clean(piece.key)}
                    onPointerDown={(e) => {
                      clean(piece.key);
                      // `releasePointerCapture` throws on a pointer it doesn't
                      // own, and a mouse never captures — release only what is held.
                      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                      }
                    }}
                  />
                )}

                {sweeping.includes(piece.key) && <Broom />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
