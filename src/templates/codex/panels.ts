import { token } from '~/lib/tokens';
import type { PanelKind } from './content';

interface Ink {
  gold: string;
  indigo: string;
  rubric: string;
  parch: string;
  moss: string;
  sage: string;
  sea: string;
  vellum: string;
  faint: string;
  serif: string;
  hand: string;
}

type Draw = (c: Ink, caption: string, label: string) => string;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const frame = (c: Ink) =>
  `<rect x="4" y="4" width="232" height="172" fill="none" stroke="${c.gold}" stroke-width="2"/>`;

const caption = (c: Ink, y: number, text: string) =>
  `<text x="120" y="${y}" text-anchor="middle" font-family="${c.serif}" font-style="italic" font-size="11" fill="${c.rubric}">${esc(text)}</text>`;

const PANELS: Record<PanelKind, Draw> = {
  // improbable elephant: 4-kneed
  beast: (c, cap) => `<svg viewBox="0 0 240 180" fill="none">
      ${frame(c)}
      <ellipse cx="120" cy="86" rx="52" ry="30" fill="${c.indigo}"/>
      <rect x="82" y="106" width="11" height="34" fill="${c.indigo}"/><rect x="104" y="106" width="11" height="34" fill="${c.indigo}"/>
      <rect x="126" y="106" width="11" height="34" fill="${c.indigo}"/><rect x="148" y="106" width="11" height="34" fill="${c.indigo}"/>
      ${[87, 109, 131, 153].map((x) => `<circle cx="${x + 0.5}" cy="122" r="4" fill="${c.gold}"/>`).join('')}
      <path d="M168 76 q 24 2 26 22 q -2 14 -14 12" stroke="${c.indigo}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <circle cx="160" cy="72" r="3.4" fill="${c.parch}"/>
      <path d="M60 80 q -14 -18 4 -28" stroke="${c.indigo}" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${caption(c, 166, cap)}
    </svg>`,
  hours: (c, cap, label) => `<svg viewBox="0 0 240 180" fill="none">
      ${frame(c)}
      <path d="M20 120 L70 70 L110 105 L150 60 L200 110 L220 95 L220 160 L20 160 Z" fill="${c.moss}"/>
      <rect x="20" y="20" width="200" height="58" fill="${c.indigo}"/>
      <rect x="150" y="20" width="70" height="58" fill="${c.vellum}"/>
      <text x="185" y="52" text-anchor="middle" font-family="${c.hand}" font-size="13" fill="${c.faint}" transform="rotate(-3 185 52)">${esc(label)}</text>
      <circle cx="60" cy="44" r="12" fill="${c.gold}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${100 + i * 9}" cy="${34 + (i % 2) * 8}" r="2" fill="${c.parch}"/>`).join('')}
      ${caption(c, 172, cap)}
    </svg>`,
  map: (c, cap, label) => `<svg viewBox="0 0 240 180" fill="none">
      ${frame(c)}
      <circle cx="120" cy="88" r="64" fill="${c.sea}" stroke="${c.indigo}" stroke-width="2"/>
      <path d="M78 70 q 20 -18 44 -6 q 18 8 8 24 q -16 10 -34 2 q -22 -6 -18 -20 Z" fill="${c.moss}"/>
      <path d="M138 108 q 22 -10 34 6 q -6 18 -26 12 q -14 -6 -8 -18 Z" fill="${c.sage}"/>
      <path d="M96 118 q 10 -8 20 0 q -4 12 -16 8 Z" fill="${c.moss}"/>
      <path d="M160 62 c 6 -10 18 -6 16 4 c 8 0 10 10 2 12 l -20 2 Z" fill="${c.rubric}"/>
      <path d="M162 66 l 10 4 M166 60 l 4 8" stroke="${c.parch}" stroke-width="1.4"/>
      <text x="120" y="40" text-anchor="middle" font-family="${c.serif}" font-size="9" letter-spacing="2" fill="${c.indigo}">${esc(label)}</text>
      ${[0, 1, 2, 3, 4, 5, 6, 7]
        .map((i) => {
          const a = (i * Math.PI) / 4;
          return `<line x1="${120 + Math.cos(a) * 64}" y1="${88 + Math.sin(a) * 64}" x2="${120 + Math.cos(a) * 70}" y2="${88 + Math.sin(a) * 70}" stroke="${c.gold}" stroke-width="2"/>`;
        })
        .join('')}
      ${caption(c, 172, cap)}
    </svg>`,
};

/**
 * Draw each `[data-panel]` element's illustration. `data-panel` picks the artwork;
 * `data-caption` and `data-label` supply the Latin inscriptions.
 */
export function initPanels(els: Iterable<HTMLElement>): void {
  // Quotes would terminate the SVG font-family attribute.
  const stack = (name: `--${string}`) => token(name).replaceAll('"', '');
  const ink: Ink = {
    gold: token('--gold'),
    indigo: token('--indigo'),
    rubric: token('--rubric'),
    parch: token('--parch'),
    moss: token('--moss'),
    sage: token('--sage'),
    sea: token('--sea'),
    vellum: token('--vellum'),
    faint: token('--faint'),
    serif: stack('--cardo'),
    hand: stack('--hand'),
  };
  for (const el of els) {
    const kind = el.dataset.panel as PanelKind;
    el.innerHTML = PANELS[kind](ink, el.dataset.caption ?? '', el.dataset.label ?? '');
  }
}
