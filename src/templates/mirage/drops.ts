import { token, tokenRgba } from '~/lib/tokens';
import type { DropArt } from './content';

/** Neon line colors (and their translucent fills) the cover drawings use, read from theme tokens. */
interface Neon {
  cyan: string;
  pink: string;
  peach: string;
  lilac: string;
  cyanFill: string;
  pinkFill: string;
  peachFill: string;
  lilacFill: string;
  pinkTint: string;
  cyanTint: string;
  font: string;
}

const readNeon = (): Neon => ({
  cyan: token('--cyan'),
  pink: token('--pink'),
  peach: token('--peach'),
  lilac: token('--lilac'),
  cyanFill: tokenRgba('--cyan', 0.06),
  pinkFill: tokenRgba('--pink', 0.14),
  peachFill: tokenRgba('--peach', 0.06),
  lilacFill: tokenRgba('--lilac', 0.08),
  pinkTint: tokenRgba('--pink', 0.2),
  cyanTint: tokenRgba('--cyan', 0.1),
  font: token('--body'),
});

type Draw = (c: Neon, label: string) => string;

const escapeText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const cassette: Draw = (c, label) => {
  const P = `stroke="${c.cyan}" stroke-width="2"`;
  return `<svg viewBox="0 0 220 220" fill="none">
      <rect x="20" y="60" width="180" height="110" rx="10" fill="${c.cyanFill}" ${P}/>
      <rect x="40" y="80" width="140" height="44" rx="6" fill="${c.pinkFill}" stroke="${c.pink}" stroke-width="2"/>
      <circle cx="75" cy="102" r="13" ${P}/><circle cx="145" cy="102" r="13" ${P}/>
      <line x1="88" y1="102" x2="132" y2="102" ${P}/>
      <path d="M75 102 l7 -5 M75 102 l-4 8 M145 102 l-7 5 M145 102 l4 -8" ${P}/>
      <rect x="60" y="138" width="100" height="16" rx="4" stroke="${c.lilac}" stroke-width="1.6"/>
      <text x="110" y="150" text-anchor="middle" fill="${c.lilac}" font-family='${c.font}' font-size="9" letter-spacing="2">${label}</text>
      <circle cx="46" cy="152" r="4" ${P}/><circle cx="174" cy="152" r="4" ${P}/></svg>`;
};

const vhs: Draw = (c, label) => {
  const P = `stroke="${c.cyan}" stroke-width="2"`;
  return `<svg viewBox="0 0 220 220" fill="none">
      <rect x="18" y="66" width="184" height="96" rx="6" fill="${c.peachFill}" stroke="${c.peach}" stroke-width="2"/>
      <rect x="34" y="82" width="152" height="40" rx="4" fill="${c.cyanTint}" ${P}/>
      <circle cx="70" cy="102" r="12" ${P}/><circle cx="150" cy="102" r="12" ${P}/>
      <line x1="82" y1="102" x2="138" y2="102" ${P}/>
      <rect x="34" y="132" width="90" height="18" fill="${c.pinkTint}" stroke="${c.pink}" stroke-width="1.6"/>
      <text x="79" y="145" text-anchor="middle" fill="${c.pink}" font-family='${c.font}' font-size="9" letter-spacing="1">${label}</text>
      <path d="M150 141 h36" stroke="${c.peach}" stroke-width="2" stroke-dasharray="4 4"/></svg>`;
};

const minidisc: Draw = (c, label) => {
  const P = `stroke="${c.cyan}" stroke-width="2"`;
  return `<svg viewBox="0 0 220 220" fill="none">
      <rect x="40" y="50" width="140" height="140" rx="10" fill="${c.lilacFill}" stroke="${c.lilac}" stroke-width="2"/>
      <circle cx="110" cy="120" r="42" ${P}/>
      <circle cx="110" cy="120" r="26" stroke="${c.pink}" stroke-width="1.6"/>
      <circle cx="110" cy="120" r="7" fill="${c.cyan}"/>
      <rect x="56" y="62" width="70" height="14" rx="3" stroke="${c.peach}" stroke-width="1.6"/>
      <text x="91" y="73" text-anchor="middle" fill="${c.peach}" font-family='${c.font}' font-size="8.5" letter-spacing="1">${label}</text>
      <path d="M150 62 l14 0 m-7 -7 l0 14" stroke="${c.pink}" stroke-width="2"/></svg>`;
};

const drawings: Record<DropArt, Draw> = { cassette, vhs, minidisc };

/** Fill every `[data-art]` element with its neon line drawing; `data-label` is the text printed on it. */
export function dropArt(els: Iterable<HTMLElement>): void {
  const neon = readNeon();
  for (const el of els) {
    const draw = drawings[el.dataset.art as DropArt];
    if (draw) el.innerHTML = draw(neon, escapeText(el.dataset.label ?? ''));
  }
}
