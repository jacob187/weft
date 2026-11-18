import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { tokenRgba } from '~/lib/tokens';

interface Petal {
  x: number;
  y: number;
  s: number;
  rot: number;
  vr: number;
  vx: number;
  vy: number;
  ph: number;
}

/** Faint vermilion petals drifting across the viewport. Removed entirely under reduced motion. */
export function initPetals(canvas: HTMLCanvasElement): void {
  if (prefersReducedMotion()) {
    canvas.remove();
    return;
  }
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

  const fill = tokenRgba('--verm', 0.16);
  const spawn = (anywhere: boolean): Petal => ({
    x: Math.random() * W,
    y: anywhere ? Math.random() * H : -20,
    s: 5 + Math.random() * 6,
    rot: Math.random() * 7,
    vr: (Math.random() - 0.5) * 0.02,
    vx: 0.25 + Math.random() * 0.4,
    vy: 0.35 + Math.random() * 0.5,
    ph: Math.random() * 7,
  });
  const count = Math.min(14, Math.floor(W / 110));
  const petals = Array.from({ length: count }, () => spawn(true));

  rafLoop((t) => {
    ctx.clearRect(0, 0, W, H);
    petals.forEach((p, i) => {
      p.x += p.vx + Math.sin(t / 1600 + p.ph) * 0.3;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > H + 20 || p.x > W + 30) petals[i] = spawn(false);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.moveTo(0, -p.s);
      ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.4, p.s * 0.7, p.s * 0.7, 0, p.s);
      ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.7, -p.s * 0.9, -p.s * 0.4, 0, -p.s);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();
    });
  }).start();
}
