import { prefersReducedMotion } from '~/lib/motion';

const ENTER = 'transform .55s cubic-bezier(.34,1.56,.64,1),opacity .3s, color .18s';

/**
 * Split each `.row[data-word]` into hoverable `.ch` letters. Unless the user prefers reduced motion,
 * every letter drops in from above (row 1) or below (row 2) with a stagger. Once it has landed the
 * inline styles are cleared, so the stylesheet's hover transform applies (inline `transform: none`
 * would otherwise mask it).
 */
export function initRiotType(root: HTMLElement): void {
  const reduced = prefersReducedMotion();
  root.querySelectorAll<HTMLElement>('.row').forEach((row, ri) => {
    [...(row.dataset.word ?? '')].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      if (!reduced) {
        s.style.opacity = '0';
        s.style.transform = `translateY(${ri ? 60 : -60}px) rotate(${(Math.random() * 14 - 7).toFixed(1)}deg)`;
        setTimeout(
          () => {
            s.style.transition = ENTER;
            s.style.opacity = '1';
            s.style.transform = 'none';
            setTimeout(() => s.removeAttribute('style'), 600);
          },
          200 + i * 70 + ri * 300,
        );
      }
      row.appendChild(s);
    });
  });
}
