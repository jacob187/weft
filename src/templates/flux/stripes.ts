import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion, reveal } from '~/lib/motion';
import type { Anomaly } from './content';
import type { AnomalyScale } from './scale';

export interface StripesOptions {
  canvas: HTMLCanvasElement;
  /** Element showing the hovered year's value. */
  readout: HTMLElement;
  anomalies: Anomaly[];
  scale: AnomalyScale;
  unit: string;
  /** Readout text while no stripe is hovered. */
  idle: string;
}

/** Stripes revealed per animation frame while the canvas paints itself in. */
const STRIPES_PER_FRAME = 3;

/** Warming stripes: one colored bar per year, painted left to right once visible; hover reads a year. */
export function stripes({ canvas, readout, anomalies, scale, unit, idle }: StripesOptions): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const colors = anomalies.map((a) => scale(a.value));
  let W = 0;
  let H = 0;
  let drawn = 0;

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const bw = W / anomalies.length;
    for (let i = 0; i < Math.min(drawn, anomalies.length); i++) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(i * bw, 0, Math.ceil(bw), H);
    }
  };

  fitCanvas(canvas, {
    maxDpr: 1.5,
    onResize: () => {
      W = canvas.width;
      H = canvas.height;
      draw();
    },
  });

  if (prefersReducedMotion()) {
    drawn = anomalies.length;
    draw();
  } else {
    const loop = rafLoop(() => {
      drawn += STRIPES_PER_FRAME;
      draw();
      if (drawn >= anomalies.length) loop.stop();
    });
    reveal([canvas], { threshold: 0.4, className: 'seen', onReveal: () => loop.start() });
  }

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const i = Math.min(anomalies.length - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * anomalies.length)));
    const d = anomalies[i];
    readout.textContent = `${d.year} · ${d.value > 0 ? '+' : ''}${d.value.toFixed(2)}${unit}`;
  });
  canvas.addEventListener('pointerleave', () => {
    readout.textContent = idle;
  });
}
