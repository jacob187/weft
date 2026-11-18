import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { parseColor, token } from '~/lib/tokens';

interface Point {
  x: number;
  y: number;
}

interface Size {
  w: number;
  h: number;
}

interface Particle extends Point {
  vx: number;
  vy: number;
  /** Square size in px. */
  s: number;
  /** Twinkle phase. */
  tw: number;
  /** Gold star rather than cool lavender. */
  warm: boolean;
}

const N = 1900;
/** How long each shape is held before morphing to the next. */
const HOLD_MS = 5200;

/** Pad or resample a point cloud to exactly N points (random scatter if it is empty). */
function fitN(pts: Point[], { w, h }: Size): Point[] {
  if (pts.length === 0) return Array.from({ length: N }, () => ({ x: Math.random() * w, y: Math.random() * h }));
  return Array.from({ length: N }, () => pts[Math.floor(Math.random() * pts.length)]);
}

/** Sample opaque pixels of an offscreen canvas on a 3px grid. */
function sample(c: CanvasRenderingContext2D, size: Size): Point[] {
  const { w, h } = size;
  const data = c.getImageData(0, 0, w, h).data;
  const pts: Point[] = [];
  const step = 3;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 128) pts.push({ x: x + (Math.random() - 0.5) * 2, y: y + (Math.random() - 0.5) * 2 });
    }
  }
  return fitN(pts, size);
}

function textTargets(word: string, font: string, size: Size): Point[] {
  const { w, h } = size;
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const c = off.getContext('2d');
  if (!c) return fitN([], size);
  const fs = Math.min(w / (word.length * 0.72), h * 0.34);
  c.font = `700 ${fs}px ${font}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(word, w / 2, h * 0.42);
  return sample(c, size);
}

function orionTargets(size: Size): Point[] {
  const { w, h } = size;
  // Orion stars (normalized x, y, radius) + belt; scatter points around star centers
  const stars = [
    [0.38, 0.18, 26], [0.62, 0.16, 24], // shoulders (Betelgeuse, Bellatrix)
    [0.3, 0.78, 24], [0.68, 0.8, 28], // feet (Saiph, Rigel)
    [0.455, 0.46, 20], [0.5, 0.5, 20], [0.545, 0.54, 20], // belt
    [0.5, 0.06, 14], // head
    [0.52, 0.62, 12], [0.535, 0.7, 12], // sword
  ];
  const pts: Point[] = [];
  const cx = w / 2;
  const cy = h * 0.44;
  const sc = Math.min(w, h) * 0.62;
  // connecting lines as light dust
  const lines = [[0, 4], [1, 6], [4, 5], [5, 6], [0, 7], [1, 7], [4, 2], [6, 3], [6, 8], [8, 9]];
  for (const [a, b] of lines) {
    for (let i = 0; i < 38; i++) {
      const t = i / 38;
      pts.push({
        x: cx + (stars[a][0] - 0.5 + (stars[b][0] - stars[a][0]) * t) * sc + (Math.random() - 0.5) * 6,
        y: cy + (stars[a][1] - 0.5 + (stars[b][1] - stars[a][1]) * t) * sc + (Math.random() - 0.5) * 6,
      });
    }
  }
  for (const [sx, sy, r] of stars) {
    const n = r * 6;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 7;
      const rr = Math.pow(Math.random(), 0.5) * r * 0.55;
      pts.push({ x: cx + (sx - 0.5) * sc + Math.cos(a) * rr, y: cy + (sy - 0.5) * sc + Math.sin(a) * rr });
    }
  }
  return fitN(pts, size);
}

function galaxyTargets({ w, h }: Size): Point[] {
  const pts: Point[] = [];
  const cx = w / 2;
  const cy = h * 0.44;
  const arms = 3;
  const sc = Math.min(w, h) * 0.4;
  for (let i = 0; i < N; i++) {
    const arm = i % arms;
    const t = Math.pow(Math.random(), 0.6);
    const ang = arm * ((Math.PI * 2) / arms) + t * 4.6 + (Math.random() - 0.5) * 0.18;
    const r = t * sc * (0.3 + Math.random() * 0.5) + sc * 0.06;
    pts.push({ x: cx + Math.cos(ang) * r * 1.3, y: cy + Math.sin(ang) * r * 0.6 });
  }
  return pts;
}

function domeTargets(size: Size): Point[] {
  const { w, h } = size;
  const pts: Point[] = [];
  const cx = w / 2;
  const cy = h * 0.62;
  const R = Math.min(w, h) * 0.42;
  // dome arc ribs
  for (let rib = 0; rib < 7; rib++) {
    const f = rib / 6;
    for (let i = 0; i < 130; i++) {
      const a = Math.PI + (i / 129) * Math.PI;
      const x = Math.cos(a) * R * (1 - f * 0.06);
      const y = Math.sin(a) * R * (0.94 - f * 0.13);
      pts.push({ x: cx + x + (Math.random() - 0.5) * 2, y: cy + y + f * R * 0.11 + (Math.random() - 0.5) * 2 });
    }
  }
  // base line
  for (let i = 0; i < 160; i++) pts.push({ x: cx - R + (i / 159) * 2 * R, y: cy + (Math.random() - 0.5) * 3 });
  return fitN(pts, size);
}

/**
 * Particle morph: N particles spring toward target point clouds that cycle between a word, Orion,
 * a galaxy and a dome, and scatter away from the pointer.
 *
 * Reads `data-word` (string) and `data-shape-names` (JSON `[orion, galaxy, dome]`) from the canvas;
 * the current shape's name is written into `label`.
 */
export function initCosmos(canvas: HTMLCanvasElement, label: HTMLElement | null): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const word = canvas.dataset.word ?? '';
  const names = [word, ...(JSON.parse(canvas.dataset.shapeNames ?? '[]') as string[])];
  const font = token('--disp');
  const [wr, wg, wb] = parseColor(token('--gold'));
  const [cr, cg, cb] = parseColor(token('--particle'));
  const reduced = prefersReducedMotion();

  const size: Size = { w: 0, h: 0 };
  let parts: Particle[] = [];
  let targets: Point[] = [];
  let mode = 0;
  let holdT = 0;
  let last = 0;
  const mouse = { x: -9999, y: -9999 };

  const builders = [
    () => textTargets(word, font, size),
    () => orionTargets(size),
    () => galaxyTargets(size),
    () => domeTargets(size),
  ];
  const buildTargets = () => {
    const m = mode % builders.length;
    targets = builders[m]();
    if (label) label.textContent = names[m];
  };

  const frame = (t: number) => {
    const { w, h } = size;
    const dt = Math.min(32, t - last);
    last = t;
    ctx.clearRect(0, 0, w, h);
    holdT += dt;
    if (holdT > HOLD_MS && !reduced) {
      holdT = 0;
      mode++;
      buildTargets();
    }
    for (let i = 0; i < N; i++) {
      const p = parts[i];
      const tg = targets[i % targets.length];
      // spring toward target
      const dx = tg.x - p.x;
      const dy = tg.y - p.y;
      p.vx += dx * 0.0016 * dt;
      p.vy += dy * 0.0016 * dt;
      // mouse repel
      const mx = p.x - mouse.x;
      const my = p.y - mouse.y;
      const md = mx * mx + my * my;
      if (md < 10000) {
        const f = (1 - md / 10000) * 0.5;
        p.vx += mx * f * 0.02 * dt;
        p.vy += my * f * 0.02 * dt;
      }
      p.vx *= 0.86;
      p.vy *= 0.86;
      p.x += p.vx;
      p.y += p.vy;
      const a = 0.35 + 0.65 * Math.abs(Math.sin(t / 900 + p.tw));
      ctx.fillStyle = p.warm ? `rgba(${wr},${wg},${wb},${a})` : `rgba(${cr},${cg},${cb},${a * 0.9})`;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    }
  };

  /** Reduced motion: park every particle on the word and draw a single static frame. */
  const drawStatic = () => {
    parts.forEach((p, i) => {
      const t = targets[i % targets.length];
      p.x = t.x;
      p.y = t.y;
    });
    requestAnimationFrame(frame);
  };

  fitCanvas(canvas, {
    maxDpr: 1,
    onResize: (w, h) => {
      size.w = w;
      size.h = h;
      buildTargets();
      if (reduced && parts.length) drawStatic();
    },
  });

  parts = Array.from({ length: N }, () => ({
    x: Math.random() * size.w,
    y: Math.random() * size.h,
    vx: 0,
    vy: 0,
    s: 0.6 + Math.random() * 1.6,
    tw: Math.random() * 7,
    warm: Math.random() < 0.12, // some gold stars
  }));

  addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  if (reduced) drawStatic();
  else rafLoop(frame).start();
}
