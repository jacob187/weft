const STAR_COUNT = 70;

/** Scatter twinkling stars (`<i>` dots, animated in CSS) across `wrap` at random positions and sizes. */
export function stars(wrap: HTMLElement): void {
  for (let i = 0; i < STAR_COUNT; i++) {
    const s = document.createElement('i');
    const size = (Math.random() * 1.8 + 0.6).toFixed(1);
    s.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;
      width:${size}px;height:${size}px;opacity:${(Math.random() * 0.7 + 0.3).toFixed(2)};
      animation-delay:${(Math.random() * 3).toFixed(1)}s`;
    wrap.appendChild(s);
  }
}
