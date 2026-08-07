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
