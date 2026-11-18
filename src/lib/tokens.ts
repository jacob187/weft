/**
 * Read design tokens (CSS custom properties) at runtime so canvas/WebGL/SVG effects follow
 * theme overrides instead of hardcoding a palette.
 */

/** Raw value of a custom property on `el` (default <html>), trimmed. */
export function token(name: `--${string}`, el: Element = document.documentElement): string {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

let probe: CanvasRenderingContext2D | null = null;

/**
 * Parse any CSS color (hex, rgb(), hsl(), named...) to [r, g, b, a] with r/g/b in 0–255 and a in 0–1.
 * Falls back to opaque black for unparseable input.
 */
export function parseColor(css: string): [number, number, number, number] {
  probe ??= document.createElement('canvas').getContext('2d');
  if (!probe) return [0, 0, 0, 1];
  probe.fillStyle = '#000';
  probe.fillStyle = css;
  const v = probe.fillStyle; // normalized: "#rrggbb" or "rgba(r, g, b, a)"
  if (v.startsWith('#')) {
    const n = parseInt(v.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const m = v.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1];
  return [m[0] ?? 0, m[1] ?? 0, m[2] ?? 0, m[3] ?? 1];
}

/** Token as [r, g, b] in 0–1, ready for a GLSL vec3 uniform. */
export function tokenVec3(name: `--${string}`, el?: Element): [number, number, number] {
  const [r, g, b] = parseColor(token(name, el));
  return [r / 255, g / 255, b / 255];
}

/** Token as an rgba() string with a replaced alpha, for canvas strokes/fills. */
export function tokenRgba(name: `--${string}`, alpha: number, el?: Element): string {
  const [r, g, b] = parseColor(token(name, el));
  return `rgba(${r},${g},${b},${alpha})`;
}
