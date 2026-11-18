import { prefersReducedMotion } from '~/lib/motion';
import { token } from '~/lib/tokens';

/** Fading glyph trail behind the cursor (fine pointers only, off under reduced motion). */
export function initCursorTrail(glyph: string): void {
  if (prefersReducedMotion() || !matchMedia('(pointer:fine)').matches) return;
  const cols = [token('--red'), token('--blue'), token('--blk')];
  let last = 0;
  addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - last < 70) return;
    last = now;
    const s = document.createElement('span');
    s.className = 'trail';
    s.textContent = glyph;
    s.style.cssText = `left:${e.clientX + 6}px;top:${e.clientY + 6}px;color:${cols[Math.floor(Math.random() * 3)]}`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  });
}
