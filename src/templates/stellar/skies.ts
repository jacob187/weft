import { token } from '~/lib/tokens';

interface Palette {
  dim: string;
  gold: string;
  lav: string;
  lavPale: string;
  star: string;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Illustration bodies keyed by `data-obj`; each is drawn over a shared field of dust. */
const ICONS: Record<string, (c: Palette) => string> = {
  venus: (c) => `<circle cx="100" cy="45" r="13" fill="${c.gold}"/>
      <circle cx="100" cy="45" r="22" stroke="${c.gold}" stroke-opacity=".25"/>
      <circle cx="100" cy="45" r="32" stroke="${c.gold}" stroke-opacity=".1"/>`,
  orion: (c) => `
      <g stroke="${c.lav}" stroke-opacity=".4">
      <line x1="70" y1="16" x2="88" y2="42"/><line x1="130" y1="14" x2="112" y2="42"/>
      <line x1="88" y1="42" x2="100" y2="48"/><line x1="100" y1="48" x2="112" y2="42"/>
      <line x1="88" y1="42" x2="66" y2="76"/><line x1="112" y1="42" x2="136" y2="78"/></g>
      <g fill="${c.star}"><circle cx="70" cy="16" r="3.4"/><circle cx="130" cy="14" r="3"/>
      <circle cx="88" cy="42" r="2.6"/><circle cx="100" cy="48" r="2.6"/><circle cx="112" cy="42" r="2.6"/>
      <circle cx="66" cy="76" r="3"/><circle cx="136" cy="78" r="3.6"/></g>`,
  andromeda: (c) => `
      <ellipse cx="100" cy="45" rx="52" ry="14" fill="${c.lav}" opacity=".16" transform="rotate(-18 100 45)"/>
      <ellipse cx="100" cy="45" rx="34" ry="8" fill="${c.lavPale}" opacity=".3" transform="rotate(-18 100 45)"/>
      <circle cx="100" cy="45" r="5" fill="${c.star}" opacity=".9"/>`,
  iss: (c) => `
      <line x1="10" y1="74" x2="190" y2="14" stroke="${c.gold}" stroke-opacity=".5" stroke-dasharray="3 6"/>
      <g transform="translate(120,36) rotate(-18)">
      <rect x="-4" y="-3" width="8" height="6" fill="${c.star}"/>
      <rect x="-18" y="-2" width="10" height="4" fill="${c.lav}"/>
      <rect x="8" y="-2" width="10" height="4" fill="${c.lav}"/></g>`,
};

/**
 * Draw the mini sky illustration named by each element's `data-obj` (venus, orion, andromeda, iss)
 * as inline SVG over a shared random field of dust.
 */
export function initSkyIcons(els: Iterable<HTMLElement>): void {
  const palette: Palette = {
    dim: token('--dim'),
    gold: token('--gold'),
    lav: token('--lav'),
    lavPale: token('--lav-pale'),
    star: token('--star'),
  };
  let dust = '';
  for (let i = 0; i < 26; i++) {
    dust += `<circle cx="${rand(4, 196)}" cy="${rand(4, 86)}" r="${rand(0.4, 1.1)}" fill="${palette.dim}" opacity="${rand(0.2, 0.6)}"/>`;
  }
  for (const el of els) {
    const icon = ICONS[el.dataset.obj ?? ''];
    if (icon) el.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 200 90" fill="none">${dust}${icon(palette)}</svg>`;
  }
}
