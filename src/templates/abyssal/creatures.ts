import { token, tokenRgba } from '~/lib/tokens';
import type { Creature } from './content';

/** Palette the creature drawings are built from, read from theme tokens. */
interface Colors {
  glow: string;
  glow2: string;
  violet: string;
  hull: string;
  ink: string;
  bone: string;
  glowFaint: string;
  glow2Faint: string;
  violetFaint: string;
  hullFill: string;
}

const readColors = (): Colors => ({
  glow: token('--glow'),
  glow2: token('--glow2'),
  violet: token('--violet'),
  hull: token('--hull'),
  ink: token('--ink'),
  bone: token('--bone'),
  glowFaint: tokenRgba('--glow', 0.1),
  glow2Faint: tokenRgba('--glow2', 0.18),
  violetFaint: tokenRgba('--violet', 0.12),
  hullFill: tokenRgba('--hull-fill', 0.75),
});

const jelly = (c: Colors) => `
  <svg viewBox="0 0 400 340" fill="none">
    <g>
      <path d="M130 150 C130 90 160 60 200 60 C240 60 270 90 270 150 C250 168 150 168 130 150 Z"
        fill="${c.glowFaint}" stroke="${c.glow}" stroke-width="2">
        <animate attributeName="d" dur="4s" repeatCount="indefinite"
          values="M130 150 C130 90 160 60 200 60 C240 60 270 90 270 150 C250 168 150 168 130 150 Z;
                  M120 146 C120 84 158 52 200 52 C242 52 280 84 280 146 C255 166 145 166 120 146 Z;
                  M130 150 C130 90 160 60 200 60 C240 60 270 90 270 150 C250 168 150 168 130 150 Z"/>
      </path>
      <path d="M150 148 C150 104 170 82 200 82 C230 82 250 104 250 148" stroke="${c.glow2}" stroke-width="1.2" opacity=".7"/>
      ${[0, 1, 2, 3, 4, 5]
        .map((i) => {
          const tx = 150 + i * 20;
          return `<path d="M${tx} 160 q-8 44 4 84 q10 34 -4 72" stroke="${i % 2 ? c.glow : c.violet}"
        stroke-width="1.4" opacity=".75" fill="none">
        <animate attributeName="d" dur="${3 + i * 0.35}s" repeatCount="indefinite"
          values="M${tx} 160 q-8 44 4 84 q10 34 -4 72;
                  M${tx} 160 q10 44 -4 84 q-10 34 6 72;
                  M${tx} 160 q-8 44 4 84 q10 34 -4 72"/></path>`;
        })
        .join('')}
      <circle cx="172" cy="118" r="3" fill="${c.glow2}"><animate attributeName="opacity" values="1;.2;1" dur="2.2s" repeatCount="indefinite"/></circle>
      <circle cx="226" cy="108" r="2.4" fill="${c.glow}"><animate attributeName="opacity" values=".3;1;.3" dur="1.8s" repeatCount="indefinite"/></circle>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 -16;0 0" dur="6s" repeatCount="indefinite"/>
    </g>
  </svg>`;

const angler = (c: Colors) => `
  <svg viewBox="0 0 400 340" fill="none">
    <g>
      <path d="M110 190 C140 130 250 120 300 165 C320 182 320 205 300 220 C250 258 140 246 110 200 Z"
        fill="${c.hullFill}" stroke="${c.hull}" stroke-width="2"/>
      <path d="M300 176 L342 150 L336 192 L346 226 L302 208" fill="${c.hullFill}" stroke="${c.hull}" stroke-width="2"/>
      <path d="M150 132 Q168 84 216 96" stroke="${c.hull}" stroke-width="2.4" fill="none"/>
      <circle cx="220" cy="98" r="7" fill="${c.glow2}">
        <animate attributeName="opacity" values="1;.25;1;.25;1" dur="1.6s" repeatCount="indefinite"/>
        <animate attributeName="r" values="7;9;7" dur="1.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="220" cy="98" r="16" fill="${c.glow2Faint}">
        <animate attributeName="r" values="16;24;16" dur="1.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="160" cy="172" r="7" fill="${c.ink}" stroke="${c.glow}" stroke-width="1.6"/>
      <circle cx="158" cy="170" r="2.2" fill="${c.glow2}"/>
      <path d="M120 206 L138 196 M136 214 L154 202 M152 222 L168 208" stroke="${c.bone}" stroke-width="2" stroke-linecap="round"/>
      <path d="M196 238 q10 12 24 8 M240 236 q8 10 20 6" stroke="${c.hull}" stroke-width="2" fill="none"/>
      <animateTransform attributeName="transform" type="translate" values="0 0;12 -8;0 0" dur="7s" repeatCount="indefinite"/>
    </g>
  </svg>`;

const siphon = (c: Colors) => `
  <svg viewBox="0 0 400 340" fill="none">
    <g>
      ${[0, 1, 2, 3, 4, 5, 6, 7]
        .map((i) => {
          const y = 50 + i * 34;
          const xx = 200 + Math.sin(i * 1.2) * 36;
          return `<g>
        <ellipse cx="${xx}" cy="${y}" rx="${17 - i * 1.2}" ry="${11 - i * 0.7}"
          fill="${c.violetFaint}" stroke="${c.violet}" stroke-width="1.4"/>
        <circle cx="${xx}" cy="${y}" r="2.2" fill="${c.glow2}">
          <animate attributeName="opacity" values="${i % 2 ? '1;.15;1' : '.15;1;.15'}" dur="${2 + i * 0.3}s" repeatCount="indefinite"/>
        </circle>
        <path d="M${xx - 6} ${y + 8} q-4 16 2 26 M${xx + 6} ${y + 8} q4 16 -2 26" stroke="${c.glow}" stroke-width=".9" opacity=".55" fill="none"/>
        </g>`;
        })
        .join('')}
      <animateTransform attributeName="transform" type="translate" values="0 0;0 -14;0 0" dur="9s" repeatCount="indefinite"/>
    </g>
  </svg>`;

const drawings: Record<Creature, (c: Colors) => string> = { jelly, angler, siphon };

/** Fill every `[data-creature]` element with its animated SVG drawing, colored from theme tokens. */
export function creatures(els: Iterable<HTMLElement>): void {
  const colors = readColors();
  for (const el of els) {
    const draw = drawings[el.dataset.creature as Creature];
    if (draw) el.innerHTML = draw(colors);
  }
}
