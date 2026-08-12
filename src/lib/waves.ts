/**
 * The two curves the site draws water and land with. They live here rather than
 * inside `WaveField` because `ShoreField` and the Carter tide edges draw the same
 * coastline — several components tracing subtly different seas would read as a
 * mistake.
 *
 * Both are plain path data, so they animate through the `swell` keyframe or sit
 * still, depending on who renders them.
 */

/** One crest and one trough. The wave repeats every 720 units. */
const PERIOD = 720;

/**
 * A closed wave band `periods` long, filled from the curve down to y=320.
 *
 * Deliberately one continuous path rather than a repeated shape: two copies laid
 * end to end share a vertical edge, and antialiasing along it leaves a hairline
 * seam that is invisible on `WaveField`'s low-opacity fills but obvious the
 * moment the fill has any contrast against its band.
 */
function swellPath(periods: number): string {
  let d = "M0,150";
  for (let i = 0; i < periods; i += 1) {
    const x = i * PERIOD;
    d += ` C${x + 120},88 ${x + 240},88 ${x + 360},150`;
    d += ` C${x + 480},212 ${x + 600},212 ${x + 720},150`;
  }
  return `${d} L${periods * PERIOD},320 L0,320 Z`;
}

/**
 * Four periods, spanning a `0 0 2880 320` viewBox — double the 1440 the layer is
 * sized to. The `swell` keyframe walks it -50%, i.e. exactly two periods, so the
 * loop returns to an identical frame and never visibly jumps.
 */
export const SWELL = swellPath(4);

/** The summit range from the mark, as a single filled silhouette. */
export const SUMMIT = "M0,320 L300,132 L452,236 L668,68 L900,252 L1128,158 L1440,320 Z";

/**
 * How long each of `ShoreField`'s water layers takes to walk its band.
 *
 * Exported rather than kept inside `ShoreField` because the 404's floating
 * litter has to keep the same time: a float bobbing on its own clock beside the
 * wave that is meant to be carrying it is the thing that gives the trick away.
 * Deliberately not multiples of each other, so the layers drift apart instead of
 * locking into one visible pulse.
 */
export const SHORE_TRAVEL = { sea: 38, swell: 27, sand: 19 } as const;

/**
 * The drawn height of each layer in px — the pixel value of the `h-*` class it
 * carries in `ShoreField`. Keep the two in step; anything floating on a layer
 * needs the number, and a Tailwind class can't be read back out.
 */
export const SHORE_LAYER_PX = { sea: 160, swell: 112, sand: 96 } as const;

/**
 * The swell curve's midline and amplitude, in viewBox units.
 *
 * `swellPath` runs from y=150 through a cubic whose midpoint sits at
 * (150 + 3·88 + 3·88 + 150) / 8 = 103.5, and a trough symmetrically at 196.5.
 * So the curve oscillates 46.5 either side of 150 — near enough a sinusoid that
 * anything riding it can be driven by a cosine and land on the water.
 */
const SWELL_MID = 150;
const SWELL_AMP = 46.5;

/** Where a layer's waterline sits at rest, in px above the section's bottom. */
export const surfaceMidPx = (layerPx: number) => layerPx - (SWELL_MID / 320) * layerPx;

/** How far that waterline rises and falls, in px. */
export const surfaceAmpPx = (layerPx: number) => (SWELL_AMP / 320) * layerPx;

/**
 * Where in its cycle a float sitting `f` of the way across the band is, as a
 * fraction of one period — which is what lets litter lock to the wave under it
 * rather than merely bob at the same rate.
 *
 * The band is drawn `w-[200%]` over a viewBox 2880 wide, so a section `W` px
 * across maps 1440 user units to `W`: a piece at `x = f·W` sits at user unit
 * `1440f`. The `swell` keyframe walks the band -50% — that is `-W` px, or -1440
 * user units — every `travel` seconds, so at time `t` that piece is looking at
 * user unit `1440f + 1440·t/travel`. Feeding that through the curve's 720-unit
 * period, and its crest at unit 180, leaves a phase of `2f - 0.25` cycles and a
 * time term with a period of `travel/2` — which is exactly `bobSeconds`.
 *
 * Every `W` cancels, which is the whole point: the offset holds at any viewport,
 * so it can be a static `animation-delay` instead of anything measured.
 */
export const wavePhaseAt = (f: number) => (((2 * f - 0.25) % 1) + 1) % 1;

/**
 * How long one bob takes, in seconds, for something floating on a layer.
 *
 * A float holds its x while the wave walks past underneath, so it rides
 * crest → trough → crest once per wave period. The `swell` keyframe moves the
 * band -50% and `SWELL` is four periods wide, so one travel covers exactly two
 * periods — two bobs — and a single bob takes half of it.
 */
export const bobSeconds = (travel: number) => travel / 2;
