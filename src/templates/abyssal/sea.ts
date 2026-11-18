import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { parseColor, token } from '~/lib/tokens';
import { scrollProgress } from './depth';

interface Plankton {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  ph: number;
  /** "r,g,b" of the glow color. */
  rgb: string;
}

const rgbOf = (name: `--${string}`) => parseColor(token(name)).slice(0, 3).join(',');

/**
 * Fixed full-window canvas: drifting plankton whose glow strengthens with depth,
 * plus light rays near the surface that fade out as the page scrolls down.
 */
export function sea(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = prefersReducedMotion();

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

  const glowRgb = rgbOf('--glow');
  const violetRgb = rgbOf('--violet');
  const rayRgb = rgbOf('--ray');
  const N = Math.min(90, Math.floor(W / 16));
  const pk: Plankton[] = Array.from({ length: N }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 0.5 + Math.random() * 1.8,
    vx: (Math.random() - 0.5) * 0.14,
    vy: -0.1 - Math.random() * 0.25,
    ph: Math.random() * 7,
    rgb: Math.random() < 0.75 ? glowRgb : violetRgb,
  }));

  let scrollP = 0;
  addEventListener(
    'scroll',
    () => {
      scrollP = scrollProgress();
    },
    { passive: true },
  );

  const frame = (t: number) => {
    ctx.clearRect(0, 0, W, H);
    // light rays near surface (fade out as you descend)
    const rayA = Math.max(0, 0.16 - scrollP * 0.5);
    if (rayA > 0) {
      for (let i = 0; i < 5; i++) {
        const rx = W * 0.15 + i * W * 0.17 + Math.sin(t / 3000 + i) * 30;
        const grad = ctx.createLinearGradient(rx, 0, rx - 120, H * 0.8);
        grad.addColorStop(0, `rgba(${rayRgb},${rayA})`);
        grad.addColorStop(1, `rgba(${rayRgb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(rx - 24, 0);
        ctx.lineTo(rx + 24, 0);
        ctx.lineTo(rx - 80, H * 0.85);
        ctx.lineTo(rx - 150, H * 0.85);
        ctx.closePath();
        ctx.fill();
      }
    }
    // plankton — glow stronger with depth
    const glowA = 0.25 + scrollP * 0.6;
    for (const p of pk) {
      p.x += p.vx + Math.sin(t / 2200 + p.ph) * 0.1;
      p.y += p.vy;
      if (p.y < -6) {
        p.y = H + 6;
        p.x = Math.random() * W;
      }
      if (p.x < -6) p.x = W + 6;
      if (p.x > W + 6) p.x = -6;
      const a = (0.25 + Math.abs(Math.sin(t / 1000 + p.ph)) * 0.6) * glowA;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = `rgba(${p.rgb},${a.toFixed(3)})`;
      ctx.fill();
    }
  };

  if (reduced) frame(0);
  else rafLoop(frame).start();
}
