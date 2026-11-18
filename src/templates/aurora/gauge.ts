import { token } from '~/lib/tokens';

/** Scale maximum of the KP index. */
const MAX = 9;
const CX = 107;
const CY = 105;
const R = 74;

/** Circular-arc path along the gauge from the left end (0) to `frac` of the half-circle sweep. */
function arc(frac: number, stroke: string, width: number): string {
  const a0 = Math.PI;
  const a1 = Math.PI * (1 + frac);
  const x0 = CX + Math.cos(a0) * R;
  const y0 = CY + Math.sin(a0) * R;
  const x1 = CX + Math.cos(a1) * R;
  const y1 = CY + Math.sin(a1) * R;
  const large = frac > 1 ? 1 : 0;
  return `<path d="M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}" fill="none"
      stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
}

/**
 * Half-circle KP gauge drawn into `svg`: ticks 0–9 (lit up to `kp`), a track, and a mint→violet value arc.
 * Reads `data-kp` and `data-label`.
 */
export function initGauge(svg: SVGSVGElement): void {
  const kp = Number(svg.dataset.kp);
  const label = svg.dataset.label ?? '';
  const mint = token('--mint');
  const violet = token('--violet');
  const icy = token('--icy');
  const faint = token('--icy-faint');
  const tickOff = token('--gauge-tick-off');

  let g = `<defs><linearGradient id="ggrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${mint}"/><stop offset="100%" stop-color="${violet}"/>
    </linearGradient></defs>`;
  for (let i = 0; i <= MAX; i++) {
    const a = Math.PI * (1 + i / MAX);
    const lit = i <= kp;
    const x1 = CX + Math.cos(a) * (R + 8);
    const y1 = CY + Math.sin(a) * (R + 8);
    const x2 = CX + Math.cos(a) * (R + 16);
    const y2 = CY + Math.sin(a) * (R + 16);
    g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lit ? mint : tickOff}" stroke-width="2"/>`;
    const tx = CX + Math.cos(a) * (R + 28);
    const ty = CY + Math.sin(a) * (R + 28);
    g += `<text x="${tx}" y="${ty + 3}" fill="${lit ? icy : faint}" font-size="9" text-anchor="middle">${i}</text>`;
  }
  g += arc(1, token('--gauge-track'), 10);
  g += arc(kp / MAX, 'url(#ggrad)', 10);
  g += `<text class="gauge-num" x="${CX}" y="${CY - 16}" text-anchor="middle" fill="${icy}"
    font-style="italic" font-size="44">${kp}</text>`;
  g += `<text class="gauge-label" x="${CX}" y="${CY + 6}" text-anchor="middle" fill="${faint}" font-size="9"
    letter-spacing="3"></text>`;
  svg.innerHTML = g;
  const labelEl = svg.querySelector('.gauge-label');
  if (labelEl) labelEl.textContent = label;
}
