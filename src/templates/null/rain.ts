import { fitCanvas } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { token, tokenRgba } from '~/lib/tokens';

const CHARS = 'アイウエオカキクケコサシスセソ0123456789ABCDEF<>/\\|=+*';
const CELL = 18;

/**
 * Matrix rain: a column of falling glyphs per 18px, drawn over a translucent fade so trails persist.
 * Ticks every 50ms (not rAF) like the original; with reduced motion it renders 60 steps once and stops.
 */
export function initRain(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const fade = tokenRgba('--void', 0.09);
  const bright = token('--ph-bright');
  const base = token('--ph-dim');
  const font = `14px ${token('--mono')}`;

  let W = 0;
  let H = 0;
  let drops: number[] = [];
  fitCanvas(canvas, {
    source: 'window',
    maxDpr: 1,
    onResize: (w, h) => {
      W = w;
      H = h;
      drops = Array.from({ length: Math.floor(w / CELL) }, () => Math.random() * -40);
    },
  });

  const step = () => {
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, W, H);
    ctx.font = font;
    drops.forEach((drop, i) => {
      const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillStyle = Math.random() < 0.08 ? bright : base;
      ctx.fillText(ch, i * CELL, drop * CELL);
      if (drop * CELL > H && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5;
    });
  };

  if (prefersReducedMotion()) {
    for (let i = 0; i < 60; i++) step();
    return;
  }
  setInterval(step, 50);
}
