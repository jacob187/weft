/**
 * Build-time hero doodles: 16 outlined stars, rings, squiggles and squares scattered with a seeded
 * PRNG (so the layout is identical on every build). Strokes reference palette tokens via `var()`.
 */
export function scatterSvg(): string {
  const tones = ['acid', 'pink', 'cyan'];
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let g = '';
  for (let i = 0; i < 16; i++) {
    const x = rnd() * 1200;
    const y = rnd() * 800;
    const tone = `var(--${tones[i % 3]})`;
    const r = rnd() * 360;
    const kind = i % 4;
    if (kind === 0) {
      g += `<path d="M${x} ${y} l14 28 l30 4 l-22 22 l6 30 l-28 -14 l-28 14 l6 -30 l-22 -22 l30 -4 Z" fill="none" style="stroke:${tone}" stroke-width="2.5" opacity=".5" transform="rotate(${r} ${x} ${y})"/>`;
    } else if (kind === 1) {
      g += `<circle cx="${x}" cy="${y}" r="${8 + rnd() * 16}" fill="none" style="stroke:${tone}" stroke-width="2.5" opacity=".4"/>`;
    } else if (kind === 2) {
      g += `<path d="M${x} ${y} q14 -26 28 0 t28 0 t28 0" fill="none" style="stroke:${tone}" stroke-width="2.5" opacity=".45" transform="rotate(${r} ${x} ${y})"/>`;
    } else {
      g += `<rect x="${x}" y="${y}" width="20" height="20" style="fill:${tone}" opacity=".3" transform="rotate(${r} ${x} ${y})"/>`;
    }
  }
  return g;
}
