import { reveal } from '~/lib/motion';

const DURATION = 1400;

/** Ease-out-cubic count from 0 to `end`, writing each frame through `format`. */
function countUp(el: HTMLElement, end: number, format: (v: number) => string): void {
  const t0 = performance.now();
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / DURATION);
    el.textContent = format(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  step(t0);
}

/**
 * Count each element up to its `data-end` the first time 60% of it is visible.
 * Elements with `data-grouped` show thousands separators.
 */
export function initCountUps(els: Iterable<HTMLElement>): void {
  reveal(els, {
    threshold: 0.6,
    className: 'counted',
    onReveal: (el) => {
      if (!(el instanceof HTMLElement)) return;
      const grouped = 'grouped' in el.dataset;
      countUp(el, Number(el.dataset.end), (v) => (grouped ? Math.round(v).toLocaleString('en-US') : String(Math.round(v))));
    },
  });
}
