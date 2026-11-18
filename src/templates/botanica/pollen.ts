import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { parseColor, token } from '~/lib/tokens';

interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  ph: number;
}

/** Slow drifting pollen motes over the whole viewport. Removed entirely under reduced motion. */
export function initPollen(canvas: HTMLCanvasElement): void {
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

  const [r, g, b] = parseColor(token('--gold'));
  const count = Math.min(26, Math.floor(W / 55));
  const motes: Mote[] = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 1 + Math.random() * 2.2,
    vx: 0.08 + Math.random() * 0.2,
    vy: -0.05 - Math.random() * 0.16,
    ph: Math.random() * 7,
  }));

  rafLoop((t) => {
    ctx.clearRect(0, 0, W, H);
    for (const m of motes) {
      m.x += m.vx + Math.sin(t / 1800 + m.ph) * 0.12;
      m.y += m.vy;
      if (m.y < -8) {
        m.y = H + 8;
        m.x = Math.random() * W;
      }
      if (m.x > W + 8) m.x = -8;
      const a = 0.14 + Math.sin(t / 900 + m.ph) * 0.08;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, 7);
      ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
      ctx.fill();
    }
  }).start();
}
