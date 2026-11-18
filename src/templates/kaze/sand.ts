import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { token, tokenRgba } from '~/lib/tokens';

/** Backing store is this many times the CSS size (the original's fixed supersample). */
const SCALE = 1.5;

const stones = [
  { x: 0.3, y: 0.38, r: 0.085 },
  { x: 0.36, y: 0.44, r: 0.05 },
  { x: 0.68, y: 0.62, r: 0.07 },
  { x: 0.74, y: 0.56, r: 0.045 },
  { x: 0.52, y: 0.75, r: 0.038 },
];

/** Karesansui: gently drifting raked-sand lines that deflect around a handful of stones. */
export function initSand(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rake = tokenRgba('--ink', 0.13);
  const moss = tokenRgba('--moss', 0.5);
  const shadow = tokenRgba('--ink', 0.14);
  const stoneColors = [token('--stone-hi'), token('--stone-mid'), token('--stone-lo')] as const;

  let W = 0;
  let H = 0;

  const draw = (t: number) => {
    ctx.clearRect(0, 0, W, H);
    // raked lines
    const gap = H / 26;
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 27; i++) {
      const y0 = i * gap + gap * 0.5;
      ctx.beginPath();
      for (let px = 0; px <= W; px += 6) {
        let y = y0 + Math.sin(px / 140 + t / 4000 + i * 0.6) * 2.2;
        // deflect around stones
        for (const s of stones) {
          const sx = s.x * W;
          const sy = s.y * H;
          const sr = s.r * W;
          const dy = y0 - sy;
          const d = Math.hypot(px - sx, dy);
          if (d < sr * 2.6) {
            const push = (1 - d / (sr * 2.6)) * sr * 0.85;
            y += dy > 0 ? push : -push;
          }
        }
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.strokeStyle = rake;
      ctx.stroke();
    }
    // stones
    for (const s of stones) {
      const sx = s.x * W;
      const sy = s.y * H;
      const sr = s.r * W;
      const g = ctx.createRadialGradient(sx - sr * 0.3, sy - sr * 0.4, sr * 0.1, sx, sy, sr);
      g.addColorStop(0, stoneColors[0]);
      g.addColorStop(0.7, stoneColors[1]);
      g.addColorStop(1, stoneColors[2]);
      ctx.beginPath();
      ctx.ellipse(sx, sy, sr, sr * 0.82, -0.15, 0, 7);
      ctx.fillStyle = g;
      ctx.fill();
      // moss hint
      ctx.beginPath();
      ctx.ellipse(sx - sr * 0.25, sy - sr * 0.45, sr * 0.4, sr * 0.22, -0.3, 0, 7);
      ctx.fillStyle = moss;
      ctx.fill();
      // shadow
      ctx.beginPath();
      ctx.ellipse(sx + sr * 0.35, sy + sr * 0.75, sr * 1.05, sr * 0.3, 0, 0, 7);
      ctx.fillStyle = shadow;
      ctx.fill();
    }
  };

  fitCanvas(canvas, {
    onResize: (w, h, dpr) => {
      W = w * SCALE;
      H = h * SCALE;
      ctx.setTransform(dpr / SCALE, 0, 0, dpr / SCALE, 0, 0);
      draw(0);
    },
  });

  if (!prefersReducedMotion()) rafLoop((t) => draw(t)).start();
}
