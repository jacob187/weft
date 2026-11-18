import { token } from '~/lib/tokens';

/** Illuminated border: double rule, corner ornaments, and a vine with leaves and gold berries down both sides. */
export function initBorder(svg: SVGSVGElement): void {
  const w = 800;
  const h = 560;
  const goldLo = token('--gold-lo');
  const gold = token('--gold');
  const indigo = token('--indigo');
  const rubric = token('--rubric');
  const leaf = token('--leaf');

  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  let g = '';
  // double rule
  g += `<rect x="6" y="6" width="${w - 12}" height="${h - 12}" fill="none" stroke="${goldLo}" stroke-width="2"/>`;
  g += `<rect x="14" y="14" width="${w - 28}" height="${h - 28}" fill="none" stroke="${gold}" stroke-width="1"/>`;
  // corner ornaments
  const corners = [
    [6, 6, 0],
    [w - 6, 6, 90],
    [w - 6, h - 6, 180],
    [6, h - 6, 270],
  ];
  for (const [cx, cy, rot] of corners) {
    g += `<g transform="translate(${cx} ${cy}) rotate(${rot})">
      <path d="M0 0 C 26 4 30 22 22 36 C 18 26 10 22 0 22 Z" fill="${indigo}"/>
      <path d="M0 0 C 4 26 22 30 36 22 C 26 18 22 10 22 0 Z" fill="${rubric}" opacity=".85"/>
      <circle cx="14" cy="14" r="5" fill="${gold}"/>
    </g>`;
  }
  // vine along each side edge with leaves & gold berries
  let seed = 9;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (const side of ['left', 'right']) {
    const s = side === 'left' ? 1 : -1;
    const x0 = side === 'left' ? 26 : w - 26;
    let d = `M ${x0} 60`;
    for (let y = 60; y < h - 60; y += 44) {
      const bow = s * (6 + rnd() * 8);
      d += ` Q ${x0 + bow} ${y + 22}, ${x0} ${y + 44}`;
    }
    g += `<path d="${d}" fill="none" stroke="${indigo}" stroke-width="1.6"/>`;
    for (let y = 82; y < h - 70; y += 44) {
      g += `<path d="M${x0} ${y} q ${8 * s} -8 ${16 * s} -2 q ${-6 * s} 8 ${-16 * s} 2 Z" fill="${leaf}"/>`;
      g += `<circle cx="${x0 + 10 * s}" cy="${y + 18}" r="3.4" fill="${gold}"/>`;
    }
  }
  svg.innerHTML = g;
}
