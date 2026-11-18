import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { parseColor, token } from '~/lib/tokens';

/**
 * Synthwave floor: pink→cyan rays converging on the horizon and 14 pink lines sliding toward the viewer.
 * Holds a single still frame under reduced motion.
 */
export function initPerspectiveGrid(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const [pr, pg, pb] = parseColor(token('--pink'));
  const [cr, cg, cb] = parseColor(token('--cyan'));
  const pink = (a: number) => `rgba(${pr},${pg},${pb},${a})`;
  const cyan = (a: number) => `rgba(${cr},${cg},${cb},${a})`;

  let W = 0;
  let H = 0;
  let off = 0;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const horizon = 0;
    const cx = W / 2;
    // vertical rays
    ctx.lineWidth = 1.4;
    for (let i = -22; i <= 22; i++) {
      const spread = i * W * 0.09;
      const g = ctx.createLinearGradient(cx, horizon, cx + spread * 3, H);
      g.addColorStop(0, pink(0));
      g.addColorStop(0.35, pink(0.55));
      g.addColorStop(1, cyan(0.5));
      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.moveTo(cx + spread * 0.12, horizon);
      ctx.lineTo(cx + spread * 3, H);
      ctx.stroke();
    }
    // horizontal lines moving toward viewer
    for (let n = 0; n < 14; n++) {
      const p = (n / 14 + off) % 1;
      const y = horizon + Math.pow(p, 2.6) * H;
      ctx.strokeStyle = pink(Math.min(0.75, p * 1.1));
      ctx.lineWidth = 1 + p * 2.4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    // glow at horizon
    const hg = ctx.createLinearGradient(0, 0, 0, 44);
    hg.addColorStop(0, pink(0.5));
    hg.addColorStop(1, pink(0));
    ctx.fillStyle = hg;
    ctx.fillRect(0, 0, W, 44);
  };

  const reduced = prefersReducedMotion();
  const loop = rafLoop(() => {
    off = (off + 0.0022) % 1;
    draw();
  });
  fitCanvas(canvas, {
    maxDpr: 1,
    onResize: (w, h) => {
      W = w;
      H = h;
      if (!loop.running) draw();
    },
  });
  if (!reduced) loop.start();
}
