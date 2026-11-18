import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { parseColor, token } from '~/lib/tokens';

interface Star {
  x: number;
  y: number;
  r: number;
  tw: number;
  sp: number;
}

/** Twinkling stars across the upper 62% of the hero. Draws a single still frame under reduced motion. */
export function initStarfield(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const [r, g, b] = parseColor(token('--white'));

  let W = 0;
  let H = 0;
  let stars: Star[] = [];
  const draw = (t: number) => {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const a = 0.3 + 0.7 * Math.abs(Math.sin((t / 900) * s.sp * 30 + s.tw));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 7);
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fill();
    }
  };

  const loop = rafLoop(draw);
  fitCanvas(canvas, {
    maxDpr: 1,
    onResize: (w, h) => {
      W = w;
      H = h;
      stars = Array.from({ length: Math.floor(W / 9) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H * 0.62,
        r: Math.random() * 1.5 + 0.3,
        tw: Math.random() * 7,
        sp: 0.02 + Math.random() * 0.05,
      }));
      if (!loop.running) draw(0);
    },
  });
  if (!prefersReducedMotion()) loop.start();
}
