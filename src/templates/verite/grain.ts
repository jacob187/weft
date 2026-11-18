import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { tokenRgba } from '~/lib/tokens';

/** Live film grain, occasional vertical scratches and dust on a half-resolution fullscreen canvas. */
export function initGrain(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let W = 0;
  let H = 0;
  fitCanvas(canvas, {
    source: 'window',
    maxDpr: 1,
    onResize: (w, h) => {
      W = Math.floor(w / 2);
      H = Math.floor(h / 2);
      canvas.width = W;
      canvas.height = H;
    },
  });

  const speck = tokenRgba('--silver', 0.16);
  const scratch = tokenRgba('--silver', 0.1);
  const dust = tokenRgba('--silver', 0.22);
  let scratchX = -1;
  let scratchLife = 0;

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    // grain specks
    ctx.fillStyle = speck;
    for (let i = 0; i < 1900; i++) {
      ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
    }
    // occasional vertical scratch
    if (scratchLife <= 0 && Math.random() < 0.02) {
      scratchX = Math.random() * W;
      scratchLife = 8 + Math.random() * 20;
    }
    if (scratchLife > 0) {
      scratchLife--;
      ctx.fillStyle = scratch;
      ctx.fillRect(scratchX + Math.random() * 1.5, 0, 1, H);
    }
    // dust blob
    if (Math.random() < 0.05) {
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 2.4 + 0.6, 0, 7);
      ctx.fillStyle = dust;
      ctx.fill();
    }
  };

  if (prefersReducedMotion()) draw();
  else rafLoop(draw).start();
}
