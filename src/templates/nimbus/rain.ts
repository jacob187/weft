import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { tokenRgba } from '~/lib/tokens';

export interface Rain {
  setActive(on: boolean): void;
}

interface Drop {
  x: number;
  y: number;
  l: number;
  v: number;
}

/** 130 falling streaks on a transparent canvas, faded in/out by CSS opacity. No animation under reduced motion. */
export function initRain(canvas: HTMLCanvasElement): Rain {
  const ctx = canvas.getContext('2d');
  let W = 0;
  let H = 0;
  let drops: Drop[] = [];
  let active = false;

  fitCanvas(canvas, {
    maxDpr: 1,
    onResize: (w, h) => {
      W = w;
      H = h;
      drops = Array.from({ length: 130 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        l: 9 + Math.random() * 16,
        v: 9 + Math.random() * 8,
      }));
    },
  });

  const stroke = tokenRgba('--rain-drop', 0.5);
  const loop = rafLoop(() => {
    if (!active || !ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.1;
    for (const d of drops) {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 2, d.y + d.l);
      ctx.stroke();
      d.y += d.v;
      d.x -= 1.2;
      if (d.y > H) {
        d.y = -20;
        d.x = Math.random() * (W + 40);
      }
    }
  });
  if (!prefersReducedMotion()) loop.start();

  return {
    setActive(on) {
      active = on;
      canvas.style.opacity = on ? '.55' : '0';
    },
  };
}
