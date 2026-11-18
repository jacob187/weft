import { parseColor, token } from '~/lib/tokens';

/** Maps a temperature anomaly to an `rgb()` color. */
export type AnomalyScale = (anomaly: number) => string;

type Rgb = [number, number, number];

const css = ([r, g, b]: Rgb) => `rgb(${r},${g},${b})`;

/**
 * Build the anomaly color scale: `stops[i]` is pinned to the `--scale-${i + 1}` token and colors
 * are blended linearly in between (clamped to the first/last color outside the range).
 */
export function readScale(stops: number[]): AnomalyScale {
  const colors = stops.map((_, i): Rgb => {
    const [r, g, b] = parseColor(token(`--scale-${i + 1}`));
    return [r, g, b];
  });
  const last = stops.length - 1;
  return (a) => {
    for (let i = 0; i < last; i++) {
      if (a >= stops[i] && a <= stops[i + 1]) {
        const t = (a - stops[i]) / (stops[i + 1] - stops[i]);
        const [c0, c1] = [colors[i], colors[i + 1]];
        return css(c0.map((ch, k) => Math.round(ch + (c1[k] - ch) * t)) as Rgb);
      }
    }
    return css(colors[a > stops[last] ? last : 0]);
  };
}
