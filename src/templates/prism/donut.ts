import { token } from '~/lib/tokens';

const SVG_NS = 'http://www.w3.org/2000/svg';

interface Segment {
  percent: number;
  /** Accent token name without the leading dashes, e.g. "mint". */
  tone: string;
}

function make(tag: string, attrs: Record<string, string | number>, text?: string): SVGElement {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  if (text !== undefined) el.textContent = text;
  return el;
}

/**
 * Spending donut. Reads `data-segments` (JSON `[{ percent, tone }]`), `data-total` and `data-caption`
 * from the SVG; each segment is stroked in its `--<tone>` token.
 */
export function initDonut(svg: SVGSVGElement): void {
  const segments = JSON.parse(svg.dataset.segments ?? '[]') as Segment[];
  const r = 44;
  const cx = 60;
  const cy = 60;
  const cf = 2 * Math.PI * r;

  let acc = 0;
  for (const { percent, tone } of segments) {
    svg.append(
      make('circle', {
        cx,
        cy,
        r,
        fill: 'none',
        stroke: token(`--${tone}`),
        'stroke-width': 14,
        'stroke-dasharray': `${((percent / 100) * cf - 3).toFixed(1)} ${cf}`,
        'stroke-dashoffset': ((-acc / 100) * cf).toFixed(1),
        transform: `rotate(-90 ${cx} ${cy})`,
        'stroke-linecap': 'round',
        opacity: 0.9,
      }),
    );
    acc += percent;
  }
  svg.append(
    make('text', { x: 60, y: 57, 'text-anchor': 'middle', class: 'donut-total', 'font-size': 15, 'font-weight': 500 }, svg.dataset.total),
    make('text', { x: 60, y: 74, 'text-anchor': 'middle', class: 'donut-caption', 'font-size': 8.5, 'letter-spacing': 1.5 }, svg.dataset.caption),
  );
}
