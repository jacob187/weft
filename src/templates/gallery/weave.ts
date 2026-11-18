import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';

/**
 * Woven-threads background: 26 slow sine "threads" stroked in colors sampled from the gallery items.
 * Colors arrive as a JSON array in `data-colors`.
 */
export function weave(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const colors: string[] = JSON.parse(canvas.dataset.colors ?? '[]');
  if (!colors.length) return;

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

  const threads = Array.from({ length: 26 }, (_, i) => ({
    color: colors[i % colors.length],
    phase: Math.random() * 7,
    amp: 40 + Math.random() * 120,
    speed: 0.00012 + Math.random() * 0.00025,
    yBase: Math.random(),
  }));

  const draw = (t: number) => {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 0.16;
    ctx.lineWidth = 1.1;
    for (const th of threads) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 14) {
        const y =
          th.yBase * H +
          Math.sin(x * 0.003 + t * th.speed * 1000 + th.phase) * th.amp +
          Math.sin(x * 0.0011 + th.phase * 2) * th.amp * 0.5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = th.color;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  if (prefersReducedMotion()) draw(0);
  else rafLoop((t) => draw(t)).start();
}
