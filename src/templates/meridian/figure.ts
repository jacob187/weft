import { token } from '~/lib/tokens';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Duotone generative cover figure: an abstracted departure board, hanging lamp, waiting figure
 * and bench, drawn as inline SVG with a film-grain filter. Colors come from the theme tokens.
 */
export function initFigure(host: HTMLElement): void {
  const wall = token('--blue');
  const wallDeep = token('--blue-deep');
  const light = token('--blue-light');
  const board = token('--board');
  const boardInk = token('--board-ink');
  const boardOff = token('--board-off');
  const alert = token('--alert');
  const cable = token('--cable');
  const floor = token('--floor');

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 400 500');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

  let g = `
  <defs>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0"/>
      <feComposite operator="over" in2="SourceGraphic"/></filter>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${wall}"/><stop offset="100%" stop-color="${wallDeep}"/>
    </linearGradient>
    <linearGradient id="lightfall" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${light}" stop-opacity=".9"/>
      <stop offset="60%" stop-color="${wall}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#wall)"/>
  <rect width="400" height="500" fill="url(#lightfall)"/>`;

  // departure board
  g += `<rect x="60" y="70" width="280" height="200" rx="6" fill="${board}"/>`;
  let seed = 3;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let r = 0; r < 8; r++) {
    const y = 92 + r * 22;
    const w1 = 40 + rnd() * 60;
    const w2 = 30 + rnd() * 40;
    const on = r < 5;
    const col = on ? boardInk : boardOff;
    g += `<rect x="80" y="${y}" width="${w1}" height="9" rx="2" fill="${col}" opacity="${on ? 0.92 : 0.5}"/>`;
    g += `<rect x="200" y="${y}" width="${w2}" height="9" rx="2" fill="${col}" opacity="${on ? 0.7 : 0.4}"/>`;
    g += `<rect x="296" y="${y}" width="24" height="9" rx="2" fill="${on && r !== 3 ? boardInk : alert}" opacity=".85"/>`;
  }

  // hanging lamp + cone of light
  g += `<line x1="200" y1="0" x2="200" y2="40" stroke="${cable}" stroke-width="4"/>
  <circle cx="200" cy="48" r="10" fill="${boardInk}"/>
  <polygon points="200,48 110,500 290,500" fill="${boardInk}" opacity=".07"/>`;

  // figure silhouette waiting
  g += `<g fill="${board}">
    <circle cx="120" cy="368" r="14"/>
    <path d="M104 500 L104 420 Q104 388 120 388 Q136 388 136 420 L136 500 Z"/>
    <rect x="130" y="398" width="26" height="7" rx="3.5" transform="rotate(18 130 398)"/>
  </g>`;

  // bench
  g += `<rect x="250" y="420" width="110" height="8" fill="${board}"/>
  <rect x="258" y="428" width="8" height="46" fill="${board}"/>
  <rect x="344" y="428" width="8" height="46" fill="${board}"/>`;

  // floor line
  g += `<rect x="0" y="474" width="400" height="26" fill="${floor}"/>`;

  svg.innerHTML = g;
  svg.setAttribute('filter', 'url(#grain)');
  host.appendChild(svg);
}
