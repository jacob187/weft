import { rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';

/** Rotate the hero sunburst a hair every frame (skipped under reduced motion). */
export function spinSunburst(svg: SVGElement): void {
  if (prefersReducedMotion()) return;
  let rot = 0;
  rafLoop(() => {
    rot += 0.014;
    svg.style.transform = `translate(-50%,-50%) rotate(${rot}deg)`;
  }).start();
}

/** Swing the dial needle 0–180° with page scroll and name the floor it points at. */
export function initLiftDial(dial: SVGElement, floorLabel: HTMLElement, floors: string[]): void {
  const needle = dial.querySelector('#needle');
  if (!needle || !floors.length) return;
  addEventListener(
    'scroll',
    () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      needle.setAttribute('transform', `rotate(${p * 180} 28 28)`);
      floorLabel.textContent = floors[Math.min(floors.length - 1, Math.floor(p * floors.length))] ?? '';
    },
    { passive: true },
  );
}
