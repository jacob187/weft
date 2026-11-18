import { prefersReducedMotion } from '~/lib/motion';

/** Tilt `el` up to 4deg toward the pointer. No-op under reduced motion. */
export function initTilt(el: HTMLElement): void {
  if (prefersReducedMotion()) return;
  addEventListener('pointermove', (e) => {
    const x = e.clientX / innerWidth - 0.5;
    const y = e.clientY / innerHeight - 0.5;
    el.style.transform = `rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
}
