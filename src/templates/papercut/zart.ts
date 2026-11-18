import { token } from '~/lib/tokens';
import type { ZineArt } from './content';

/** Riso inks and paper stocks the cover drawings are printed with. */
interface Inks {
  red: string;
  blue: string;
  pink: string;
  peach: string;
  sky: string;
  white: string;
}

const readInks = (): Inks => ({
  red: token('--riso-red'),
  blue: token('--riso-blue'),
  pink: token('--riso-pink'),
  peach: token('--peach'),
  sky: token('--sky'),
  white: token('--white'),
});

const flower = (c: Inks) => `<svg width="120" height="130" viewBox="0 0 120 130" fill="none">
      <rect x="40" y="70" width="40" height="50" fill="${c.blue}" opacity=".8"/>
      <line x1="60" y1="70" x2="60" y2="34" stroke="${c.red}" stroke-width="3"/>
      ${[0, 60, 120, 180, 240, 300]
        .map((a) => `<ellipse cx="60" cy="30" rx="7" ry="14" fill="${c.red}" opacity=".78" transform="rotate(${a} 60 30)"/>`)
        .join('')}
      <circle cx="60" cy="30" r="6" fill="${c.blue}"/></svg>`;

const bus = (c: Inks) => `<svg width="120" height="130" viewBox="0 0 120 130" fill="none">
      <rect x="12" y="30" width="96" height="56" rx="10" fill="${c.red}" opacity=".85"/>
      <rect x="20" y="40" width="26" height="20" rx="4" fill="${c.peach}"/>
      <rect x="52" y="40" width="26" height="20" rx="4" fill="${c.peach}"/>
      <circle cx="30" cy="96" r="9" fill="${c.blue}"/>
      <circle cx="90" cy="96" r="9" fill="${c.blue}"/>
      <path d="M84 22 q10 -14 22 -6" stroke="${c.blue}" stroke-width="3" fill="none"/>
      <path d="M12 110 h96" stroke="${c.blue}" stroke-width="2" stroke-dasharray="5 5"/></svg>`;

const puddle = (c: Inks) => `<svg width="120" height="130" viewBox="0 0 120 130" fill="none">
      <ellipse cx="60" cy="80" rx="44" ry="20" fill="${c.blue}" opacity=".7"/>
      <ellipse cx="60" cy="76" rx="30" ry="12" fill="${c.sky}"/>
      <ellipse cx="60" cy="76" rx="30" ry="12" fill="${c.blue}" opacity=".35"/>
      ${[0, 1, 2, 3, 4]
        .map(
          (i) =>
            `<path d="M${28 + i * 16} ${20 + (i % 2) * 8} q3 8 -2 14" stroke="${c.red}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
        )
        .join('')}
      <path d="M46 70 q14 -8 28 0" stroke="${c.red}" stroke-width="2" fill="none"/></svg>`;

const fridge = (c: Inks) => {
  const magnets: [string, number, string][] = [
    ['26', 30, c.red],
    ['58', 30, c.blue],
    ['40', 52, c.blue],
    ['70', 52, c.red],
    ['30', 74, c.blue],
    ['62', 74, c.red],
    ['46', 96, c.red],
  ];
  return `<svg width="120" height="130" viewBox="0 0 120 130" fill="none">
      <rect x="24" y="14" width="72" height="102" rx="6" fill="${c.white}" stroke="${c.blue}" stroke-width="3"/>
      ${magnets
        .map(
          ([x, y, fill], i) =>
            `<rect x="${x}" y="${y}" width="${18 + (i % 3) * 8}" height="12" rx="2" fill="${fill}" opacity=".85" transform="rotate(${i % 2 ? 2 : -3} ${x} ${y})"/>`,
        )
        .join('')}
      <circle cx="96" cy="20" r="7" fill="${c.pink}"/></svg>`;
};

const arts: Record<ZineArt, (c: Inks) => string> = { flower, bus, puddle, fridge };

/** Fill every `[data-zart]` element with its two-color riso cover drawing. */
export function zineArt(els: Iterable<HTMLElement>): void {
  const inks = readInks();
  for (const el of els) {
    const draw = arts[el.dataset.zart as ZineArt];
    if (draw) el.innerHTML = draw(inks);
  }
}
