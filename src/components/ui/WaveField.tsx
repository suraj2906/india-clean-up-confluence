/**
 * The identity drawn instead of photographed: deep water, the pale summit behind
 * it, and the sky-blue wave breaking in front — the three marks of the ICUC logo,
 * as a backdrop that costs two gradients and an inline SVG rather than a photo.
 *
 * It exists because the hero lays white copy straight over it. A photograph has
 * to be scrimmed until it is almost black before white text is safe on it, which
 * is what buried the key art before; a drawn backdrop is simply dark where the
 * copy sits and bright where it doesn't, and it can't be cropped wrong on a phone.
 *
 * No `"use client"` — it is markup, so it stays free in whichever component
 * renders it.
 */

/** Two identical periods across the viewBox, so a -50% shift loops seamlessly. */
const SWELL =
  "M0,150 C120,88 240,88 360,150 C480,212 600,212 720,150 " +
  "C840,88 960,88 1080,150 C1200,212 1320,212 1440,150 L1440,320 L0,320 Z";

/** Back to front: slower and fainter behind, quicker and brighter at the break. */
const LAYERS = [
  { fill: "fill-sky-700", opacity: 0.34, duration: "34s", height: "h-[58%]", shift: "translate-y-6" },
  { fill: "fill-sky-600", opacity: 0.26, duration: "24s", height: "h-[48%]", shift: "translate-y-2" },
  { fill: "fill-sky", opacity: 0.16, duration: "17s", height: "h-[38%]", shift: "translate-y-0" },
] as const;

export function WaveField() {
  return (
    <div aria-hidden className="bg-deepwater absolute inset-0 overflow-hidden">
      {/* The summit, sitting behind the water the way it does in the mark. */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[52%] w-full"
      >
        <path
          d="M0,320 L300,132 L452,236 L668,68 L900,252 L1128,158 L1440,320 Z"
          className="fill-summit"
          opacity="0.09"
        />
      </svg>

      {LAYERS.map((layer) => (
        <div
          key={layer.fill}
          className={`absolute inset-x-0 bottom-0 ${layer.height} ${layer.shift}`}
        >
          {/* Drawn at double width and walked left by half of it — see `swell`.
              The viewBox has to span both copies or the second one is clipped away. */}
          <svg
            viewBox="0 0 2880 320"
            preserveAspectRatio="none"
            className="animate-swell h-full w-[200%]"
            style={{ animationDuration: layer.duration }}
          >
            <path d={SWELL} className={layer.fill} opacity={layer.opacity} />
            <path d={SWELL} className={layer.fill} opacity={layer.opacity} transform="translate(1440)" />
          </svg>
        </div>
      ))}
    </div>
  );
}
