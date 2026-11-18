import { reveal } from '~/lib/motion';

const DURATION = 1500;

/**
 * Count each `[data-count]` element up from 0 to its value (ease-out cubic) when it scrolls into view.
 * `data-dec` sets the decimal places.
 */
export function countUps(els: Iterable<HTMLElement>): void {
  reveal(els, {
    threshold: 0.6,
    className: 'counted',
    onReveal: (el) => {
      if (!(el instanceof HTMLElement)) return;
      const end = Number(el.dataset.count);
      const dec = Number(el.dataset.dec ?? 0);
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / DURATION);
        el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
      };
      step(t0);
    },
  });
}
