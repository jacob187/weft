import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { tokenRgba } from '~/lib/tokens';

/** Blob tints: palette token and peak alpha. */
const TINTS: [`--${string}`, number][] = [
  ['--butter', 0.55],
  ['--berry', 0.5],
  ['--mint', 0.45],
  ['--sky', 0.45],
];

/**
 * Gooey background blobs: seven radial-gradient discs that drift on sine paths and
 * spring toward the pointer. Under reduced motion a single frame is painted (and repainted on resize).
 */
export function initGoo(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let W = 0;
  let H = 0;
  fitCanvas(canvas, {
    source: 'window',
    maxDpr: 1,
    onResize: (w, h) => {
      W = w;
      H = h;
    },
  });

  const tints = TINTS.map(([name, alpha]) => ({
    solid: tokenRgba(name, alpha),
    clear: tokenRgba(name, 0),
  }));
  const blobs = Array.from({ length: 7 }, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 60 + Math.random() * 90,
    tint: tints[i % tints.length],
    ph: Math.random() * 7,
    sp: 0.3 + Math.random() * 0.5,
    amp: 40 + Math.random() * 70,
    bx: Math.random() * W,
    by: Math.random() * H,
  }));

  let mx = W / 2;
  let my = H / 2;
  addEventListener('pointermove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  const draw = (t: number) => {
    ctx.clearRect(0, 0, W, H);
    blobs.forEach((b, i) => {
      const pull = 0.05 * ((i % 3) + 1) * 0.4;
      const tx = b.bx + Math.sin((t / 2400) * b.sp + b.ph) * b.amp + (mx - W / 2) * pull;
      const ty = b.by + Math.cos((t / 2900) * b.sp + b.ph) * b.amp + (my - H / 2) * pull;
      b.x += (tx - b.x) * 0.02;
      b.y += (ty - b.y) * 0.02;
      const g = ctx.createRadialGradient(b.x, b.y, b.r * 0.1, b.x, b.y, b.r);
      g.addColorStop(0, b.tint.solid);
      g.addColorStop(1, b.tint.clear);
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, 7);
      ctx.fillStyle = g;
      ctx.fill();
    });
  };

  if (prefersReducedMotion()) {
    draw(0);
    addEventListener('resize', () => draw(0));
  } else {
    rafLoop(draw).start();
  }
}
