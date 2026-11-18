import type { PastryArt } from './content';

/**
 * Build-time pastry illustrations. Every paint is a `var(--token)` reference, so theme overrides recolor them.
 */

const INK = 'stroke:var(--cocoa);stroke-width:4;stroke-linecap:round;stroke-linejoin:round';
const paint = (fill: string) => `style="fill:var(--${fill});${INK}"`;
const line = `style="${INK}"`;
const noFill = `style="fill:none;${INK}"`;

const SPRINKLES: [number, number, string][] = [
  [38, 36, 'cocoa'],
  [54, 32, 'paper'],
  [72, 34, 'butter'],
  [84, 44, 'mint'],
  [32, 46, 'sky'],
  [68, 44, 'paper'],
];

const ART: Record<PastryArt, string> = {
  croissant: `<svg width="140" height="100" viewBox="0 0 140 100" fill="none">
      <path d="M52 30 C60 24 80 24 88 30 C96 36 98 52 92 62 L100 58 C112 52 124 58 124 68 C124 78 112 82 100 78 L88 72 C82 78 58 78 52 72 L40 78 C28 82 16 78 16 68 C16 58 28 52 40 58 L48 62 C42 52 44 36 52 30 Z" ${paint('butter')}/>
      <path d="M55 34 L50 66 M70 30 L70 70 M85 34 L90 66" ${line} opacity=".8"/>
      <path d="M24 62 L34 68 M116 62 L106 68" ${line} opacity=".6"/></svg>`,
  donut: `<svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <ellipse cx="60" cy="54" rx="44" ry="38" ${paint('dough')}/>
      <path d="M20 50 C24 34 40 22 60 22 C80 22 96 34 100 50 C96 58 88 56 82 52 C76 60 66 58 62 52 C56 62 44 60 40 52 C34 58 24 58 20 50 Z" ${paint('berry')}/>
      <ellipse cx="60" cy="54" rx="12" ry="10" ${paint('cream')}/>
      ${SPRINKLES.map(
        ([sx, sy, tone]) =>
          `<rect x="${sx}" y="${sy}" width="7" height="3.4" rx="1.7" style="fill:var(--${tone})" transform="rotate(${(sx * 7) % 80 - 40} ${sx} ${sy})"/>`,
      ).join('')}</svg>`,
  roll: `<svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <ellipse cx="60" cy="58" rx="42" ry="34" ${paint('crust')}/>
      <path d="M60 58 m-28 0 a28 22 0 1 1 56 0 a20 15 0 1 1 -40 0 a12 9 0 1 1 24 0" ${noFill}/>
      <path d="M30 40 C40 30 80 30 92 42" style="fill:none;stroke:var(--paper);stroke-width:7;stroke-linecap:round" opacity=".85"/>
      <path d="M38 34 C50 27 74 27 84 35" style="fill:none;stroke:var(--paper);stroke-width:5;stroke-linecap:round" opacity=".6"/></svg>`,
  loaf: `<svg width="130" height="100" viewBox="0 0 130 100" fill="none">
      <path d="M18 66 C14 40 34 26 65 26 C96 26 116 40 112 66 C110 78 96 82 65 82 C34 82 20 78 18 66 Z" ${paint('crust')}/>
      <path d="M38 34 L48 48 M60 30 L70 46 M84 34 L92 48" ${line}/>
      <ellipse cx="47" cy="64" rx="3.4" ry="2.6" style="fill:var(--cocoa)" opacity=".55"/>
      <ellipse cx="80" cy="62" rx="3" ry="2.4" style="fill:var(--cocoa)" opacity=".55"/></svg>`,
};

export const pastrySvg = (art: PastryArt): string => ART[art];
