import { prefersReducedMotion, reveal } from '~/lib/motion';
import { token, tokenRgba } from '~/lib/tokens';
import type { KeelingSeries } from './content';

/** Inset that keeps the line off the chart's top and bottom edges, in viewBox units. */
const PAD_TOP = 30;
const PAD_BOTTOM = 10;
const DRAW_TRANSITION = 'stroke-dashoffset 3.4s cubic-bezier(.4,0,.3,1)';

/**
 * Keeling curve as an inline SVG: gradient line + faded area under it + labelled gridlines.
 * Drawn into the svg's own viewBox; the line draws itself in once the chart scrolls into view.
 */
export function keeling(svg: SVGSVGElement, series: KeelingSeries): void {
  const { width: W, height: H } = svg.viewBox.baseVal;
  const { ppm, min, max, gridlines, unit } = series;
  const yOf = (v: number) => H - ((v - min) / (max - min)) * (H - PAD_TOP) - PAD_BOTTOM;
  const n = ppm.length - 1;

  const d = ppm
    .map((v, i) => {
      const px = (i / n) * W;
      const py = yOf(v).toFixed(1);
      return i === 0 ? `M ${px} ${py}` : ` L ${px.toFixed(1)} ${py}`;
    })
    .join('');
  const dArea = `${d} L ${W} ${H} L 0 ${H} Z`;

  const mono = token('--mono');
  const grid = gridlines
    .map((p) => {
      const y = yOf(p);
      return `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${tokenRgba('--paper', 0.09)}" stroke-dasharray="4 8"/>
      <text x="8" y="${y - 6}" fill="${token('--faint')}" font-family='${mono}' font-size="11">${p} ${unit}</text>`;
    })
    .join('');

  svg.innerHTML = `
    <defs>
      <linearGradient id="kline" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${token('--cold2')}"/><stop offset="55%" stop-color="${token('--warm')}"/>
        <stop offset="100%" stop-color="${token('--crit')}"/></linearGradient>
      <linearGradient id="karea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${token('--hot')}" stop-opacity=".18"/>
        <stop offset="100%" stop-color="${token('--hot')}" stop-opacity="0"/></linearGradient>
    </defs>
    ${grid}
    <path d="${dArea}" fill="url(#karea)"/>
    <path id="kpath" d="${d}" fill="none" stroke="url(#kline)" stroke-width="2.2"/>`;

  if (prefersReducedMotion()) return;
  const path = svg.querySelector<SVGPathElement>('#kpath');
  if (!path) return;
  const len = path.getTotalLength();
  path.style.strokeDasharray = String(len);
  path.style.strokeDashoffset = String(len);
  reveal([svg], {
    threshold: 0.4,
    className: 'seen',
    onReveal: () => {
      path.style.transition = DRAW_TRANSITION;
      requestAnimationFrame(() => {
        path.style.strokeDashoffset = '0';
      });
    },
  });
}
