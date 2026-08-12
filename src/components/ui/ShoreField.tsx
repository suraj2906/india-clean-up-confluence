import { SHORE_TRAVEL, SUMMIT, SWELL } from "@/lib/waves";

/**
 * Carter Road drawn rather than photographed: headland, sea, a pale beach, and
 * mangroves standing at both edges of the frame. `WaveField` does the same job
 * on the landing page but in deep water under white copy; this is its daylight
 * twin, for a section that carries `ink` text.
 *
 * It paints no background of its own — the hero keeps `bg-skywash` and this
 * lays a shoreline across the bottom of it, so the sky above the waterline is
 * unchanged and the headline never has water behind it.
 *
 * No `"use client"` — like `WaveField`, it is markup, so it costs nothing.
 */

/**
 * Back to front: slower and fainter out at sea, quicker and paler at the break,
 * with the last layer standing in for wet sand. The durations are deliberately
 * not multiples of each other, so the layers drift apart instead of locking into
 * one visible pulse.
 *
 * Heights are fixed rather than percentages — the hero's bottom padding is sized
 * to match the tallest of them, and a percentage would grow with the section and
 * run the water up behind the buttons. The sea layers have to be this saturated
 * to register on `bg-skywash`, which is already pale sky at the top.
 *
 * The travel times come from `SHORE_TRAVEL` rather than living here, because the
 * 404's floating litter derives its bob from the same numbers.
 *
 * The front layer is `shell`, which is deliberately the same colour as the section
 * that follows. That is what stops the picture looking guillotined: the water
 * breaks onto a beach, and the beach simply carries on into the next section
 * instead of meeting a hard line at the bottom of this one.
 */
const LAYERS = [
  { key: "sea", fill: "fill-summit", opacity: 0.55, duration: `${SHORE_TRAVEL.sea}s`, height: "h-40" },
  { key: "swell", fill: "fill-sky-300", opacity: 0.4, duration: `${SHORE_TRAVEL.swell}s`, height: "h-28" },
  { key: "sand", fill: "fill-shell", opacity: 1, duration: `${SHORE_TRAVEL.sand}s`, height: "h-24" },
] as const;

/**
 * One mangrove, drawn from its base at the origin and growing upward. The
 * arching prop roots are the whole point — they are what makes the silhouette
 * read as a mangrove rather than a generic tree, which is the shape that
 * actually lines this stretch of Carter Road.
 */
function Mangrove() {
  return (
    <g>
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
        <path d="M0,0 C-3,-16 -16,-24 -30,-30" />
        <path d="M0,0 C3,-16 16,-24 29,-31" />
        <path d="M-16,0 C-14,-13 -9,-21 -4,-28" />
        <path d="M17,0 C15,-13 10,-21 5,-29" />
      </g>
      <path d="M-4.5,-26 L4.5,-26 L2.5,-54 L-2.5,-54 Z" fill="currentColor" />
      <ellipse cx="-21" cy="-62" rx="19" ry="13" fill="currentColor" />
      <ellipse cx="23" cy="-64" rx="20" ry="14" fill="currentColor" />
      <ellipse cx="0" cy="-72" rx="28" ry="19" fill="currentColor" />
      <ellipse cx="3" cy="-86" rx="17" ry="12" fill="currentColor" />
    </g>
  );
}

/** Base x and scale, in the 420-wide viewBox each stand is drawn into. */
const STAND = [
  { x: 46, s: 1 },
  { x: 152, s: 0.68 },
  { x: 268, s: 0.86 },
  { x: 372, s: 0.58 },
];

/**
 * A clump of mangroves anchored to one side of the frame.
 *
 * Each side gets its own `<svg>` with a `meet` aspect ratio rather than one
 * full-width band, for two reasons: `preserveAspectRatio="none"` — which the
 * water layers use freely, since a stretched wave is still a wave — would smear
 * the trees into unrecognisable blobs, and a single centred band would crop its
 * outer trees away entirely on a phone. Anchoring each side keeps the trees in
 * proportion and on screen at every width, and leaves the middle of the frame
 * open, which is where the copy sits.
 */
function MangroveStand({ side }: { side: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 420 200"
      preserveAspectRatio={side === "left" ? "xMinYMax meet" : "xMaxYMax meet"}
      // Lifted clear of the section edge so the trees stand *on* the beach with
      // ground visible beneath them. Sitting at `bottom-0` put their roots on the
      // very last pixel of the section, which read as the picture being cut off.
      className={`absolute bottom-8 h-32 w-56 text-sky-700 sm:bottom-10 sm:h-44 sm:w-[26rem] ${
        side === "left" ? "left-0" : "right-0 -scale-x-100"
      }`}
    >
      <g opacity="0.42">
        {STAND.map((tree) => (
          <g key={tree.x} transform={`translate(${tree.x} 186) scale(${tree.s})`}>
            <Mangrove />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function ShoreField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* The headland, sitting behind the water the way the summit does in the mark. */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-36 w-full"
      >
        <path d={SUMMIT} className="fill-summit" opacity="0.3" />
      </svg>

      {LAYERS.map((layer) => (
        <div key={layer.key} className={`absolute inset-x-0 bottom-0 ${layer.height}`}>
          {/* Drawn at double width and walked left by half of it — see `swell`. */}
          <svg
            viewBox="0 0 2880 320"
            preserveAspectRatio="none"
            className="animate-swell h-full w-[200%]"
            style={{ animationDuration: layer.duration }}
          >
            <path d={SWELL} className={layer.fill} opacity={layer.opacity} />
          </svg>
        </div>
      ))}

      {/* Static on purpose. The water moves; the trees are the thing that tells
          you which beach this is, and they do that better standing still. */}
      <MangroveStand side="left" />
      <MangroveStand side="right" />
    </div>
  );
}
