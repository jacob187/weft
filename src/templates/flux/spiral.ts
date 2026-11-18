import { rafLoop } from '~/lib/canvas';
import { prefersReducedMotion, reveal } from '~/lib/motion';
import { token, tokenRgba } from '~/lib/tokens';
import type { Anomaly, SpiralRing } from './content';
import type { AnomalyScale } from './scale';

export interface SpiralOptions {
  canvas: HTMLCanvasElement;
  /** Element showing the year currently being drawn. */
  yearEl: HTMLElement;
  anomalies: Anomaly[];
  scale: AnomalyScale;
  months: string[];
  rings: SpiralRing[];
}

interface MonthPoint {
  year: number;
  month: number;
  anomaly: number;
}

/** Logical canvas size in px (the backing store is this × DPR). */
const S = 460;
/** Monthly points drawn per animation frame. */
const POINTS_PER_FRAME = 18;
/** Pause after a full spiral before it restarts, ms. */
const RESTART_DELAY = 4200;

/**
 * Climate spiral: each year's twelve monthly anomalies wind once around a dial, radius growing
 * with temperature. Monthly values are synthesized from the yearly anomaly (seasonal wobble + jitter).
 * Draws in once visible, then loops.
 */
export function spiral({ canvas, yearEl, anomalies, scale, months, rings }: SpiralOptions): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const cx = S / 2;
  const cy = S / 2;
  const dpr = Math.min(devicePixelRatio, 2);
  canvas.width = S * dpr;
  canvas.height = S * dpr;
  ctx.scale(dpr, dpr);

  const faint = token('--faint');
  const ringStroke = tokenRgba('--paper', 0.14);
  const font = `11px ${token('--mono')}`;

  const pts: MonthPoint[] = anomalies.flatMap(({ year, value }) =>
    Array.from({ length: 12 }, (_, month) => ({
      year,
      month,
      anomaly: value + Math.sin((month / 12) * Math.PI * 2 + year * 0.3) * 0.05 + (Math.random() - 0.5) * 0.02,
    })),
  );

  const rad = (a: number) => 40 + ((a + 0.6) / 2.1) * 170;
  const angle = (month: number) => (month / 12) * Math.PI * 2 - Math.PI / 2;

  const face = () => {
    ctx.clearRect(0, 0, S, S);
    ctx.font = font;
    ctx.fillStyle = faint;
    ctx.textAlign = 'center';
    months.forEach((mo, i) => {
      const ang = angle(i);
      ctx.fillText(mo, cx + Math.cos(ang) * 212, cy + Math.sin(ang) * 212 + 4);
    });
    for (const { value, label } of rings) {
      ctx.beginPath();
      ctx.arc(cx, cy, rad(value), 0, 7);
      ctx.strokeStyle = ringStroke;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = faint;
      ctx.fillText(label, cx, cy - rad(value) - 5);
    }
  };

  const segments = (from: number, to: number) => {
    for (let i = Math.max(1, from); i < to; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const a0 = angle(p0.month);
      const a1 = angle(p1.month);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a0) * rad(p0.anomaly), cy + Math.sin(a0) * rad(p0.anomaly));
      ctx.lineTo(cx + Math.cos(a1) * rad(p1.anomaly), cy + Math.sin(a1) * rad(p1.anomaly));
      ctx.strokeStyle = scale(p1.anomaly);
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  };

  face();
  if (prefersReducedMotion()) {
    segments(1, pts.length);
    yearEl.textContent = String(anomalies[anomalies.length - 1].year);
    return;
  }

  let idx = 0;
  const loop = rafLoop(() => {
    const next = Math.min(pts.length, idx + POINTS_PER_FRAME);
    segments(idx, next);
    idx = next;
    yearEl.textContent = String(pts[Math.min(idx, pts.length - 1)].year);
    if (idx >= pts.length) {
      loop.stop();
      setTimeout(() => {
        idx = 0;
        face();
        loop.start();
      }, RESTART_DELAY);
    }
  });
  reveal([canvas], { threshold: 0.4, className: 'seen', onReveal: () => loop.start() });
}
