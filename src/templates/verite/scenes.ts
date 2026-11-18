import { token } from '~/lib/tokens';
import type { SceneKind } from './content';

interface Palette {
  sil: string;
  amb: string;
  bg: string;
  dk: string;
  line: string;
  glass: string;
  sky: string;
  night: string;
  wave: string;
}

const SCENES: Record<SceneKind, (c: Palette) => string> = {
  lighthouse: (c) => `<svg viewBox="0 0 300 225">
      <rect width="300" height="225" fill="${c.bg}"/>
      <rect x="0" y="150" width="300" height="75" fill="${c.dk}"/>
      <path d="M0 158 q40 -8 75 0 t80 0 t80 0 t65 0 L300 225 L0 225 Z" fill="${c.wave}"/>
      <rect x="128" y="52" width="34" height="100" fill="${c.dk}"/>
      <path d="M124 52 L166 52 L160 30 L130 30 Z" fill="${c.dk}"/>
      <circle cx="145" cy="40" r="7" fill="${c.amb}"/>
      <polygon points="152,36 290,10 290,66" fill="${c.amb}" opacity=".14"/>
      <polygon points="138,36 10,16 10,60" fill="${c.amb}" opacity=".08"/>
      <line x1="120" y1="152" x2="170" y2="152" stroke="${c.line}" stroke-width="3"/>
      <circle cx="70" cy="26" r="10" fill="${c.sil}" opacity=".8"/>
    </svg>`,
  window: (c) => `<svg viewBox="0 0 300 225">
      <rect width="300" height="225" fill="${c.dk}"/>
      <rect x="90" y="24" width="120" height="170" fill="${c.bg}"/>
      <rect x="98" y="32" width="104" height="154" fill="${c.glass}"/>
      <line x1="150" y1="32" x2="150" y2="186" stroke="${c.dk}" stroke-width="5"/>
      <line x1="98" y1="108" x2="202" y2="108" stroke="${c.dk}" stroke-width="5"/>
      <path d="M98 70 q30 20 52 38 l0 78 l-52 0 Z" fill="${c.amb}" opacity=".13"/>
      <g fill="${c.dk}">
        <ellipse cx="128" cy="150" rx="13" ry="5"/>
        <path d="M120 150 L120 118 Q120 104 132 104 Q141 104 141 116 L138 150 Z"/>
        <circle cx="130" cy="96" r="8.4"/>
      </g>
      <circle cx="240" cy="180" r="16" fill="${c.amb}" opacity=".55"/>
      <rect x="236" y="196" width="8" height="14" fill="${c.line}"/>
    </svg>`,
  road: (c) => `<svg viewBox="0 0 300 225">
      <rect width="300" height="225" fill="${c.bg}"/>
      <rect x="0" y="0" width="300" height="90" fill="${c.sky}"/>
      <path d="M0 90 L300 90 L300 96 L0 96 Z" fill="${c.dk}" opacity=".7"/>
      <path d="M110 225 L150 90 L160 90 L230 225 Z" fill="${c.dk}"/>
      ${[0, 1, 2, 3, 4]
        .map((i) => {
          const t = i / 4.6;
          const y = 210 - t * 105;
          const w = 6 - t * 4.4;
          const x0 = 168 - t * 14;
          return `<rect x="${x0}" y="${y}" width="${w}" height="${10 - t * 7}" fill="${c.amb}" opacity="${0.9 - t * 0.5}"/>`;
        })
        .join('')}
      <circle cx="42" cy="34" r="12" fill="${c.sil}" opacity=".9"/>
      ${[0, 1, 2].map((i) => `<path d="M${252 + i * 14} ${112 + i * 6} l0 ${26 - i * 6}" stroke="${c.dk}" stroke-width="5"/>`).join('')}
      <path d="M250 112 q10 -16 22 -2 q12 -10 18 4" fill="none" stroke="${c.dk}" stroke-width="4"/>
    </svg>`,
  sea: (c) => `<svg viewBox="0 0 300 225">
      <rect width="300" height="225" fill="${c.night}"/>
      <rect x="0" y="118" width="300" height="107" fill="${c.dk}"/>
      ${[0, 1, 2, 3].map((i) => `<path d="M0 ${132 + i * 22} q30 -5 60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="${c.line}" stroke-width="2"/>`).join('')}
      <g>
        <path d="M96 126 L210 126 L200 108 L106 108 Z" fill="${c.dk}" stroke="${c.glass}" stroke-width="2"/>
        <rect x="138" y="86" width="30" height="22" fill="${c.dk}" stroke="${c.glass}" stroke-width="2"/>
        <line x1="153" y1="86" x2="153" y2="66" stroke="${c.glass}" stroke-width="3"/>
        <circle cx="153" cy="96" r="4" fill="${c.amb}"/>
      </g>
      <circle cx="248" cy="42" r="14" fill="${c.sil}" opacity=".7"/>
      <path d="M234 42 a14 14 0 0 0 28 0" fill="${c.night}" opacity=".55"/>
    </svg>`,
};

/** Draw each `[data-scene]` frame's duotone illustration (prepended, so the caption stays on top). */
export function initScenes(frames: Iterable<HTMLElement>): void {
  const palette: Palette = {
    sil: token('--silver'),
    amb: token('--amber'),
    bg: token('--scene-bg'),
    dk: token('--black'),
    line: token('--frame-line'),
    glass: token('--scene-glass'),
    sky: token('--scene-sky'),
    night: token('--scene-night'),
    wave: token('--scene-wave'),
  };
  for (const el of frames) {
    el.insertAdjacentHTML('afterbegin', SCENES[el.dataset.scene as SceneKind](palette));
  }
}
