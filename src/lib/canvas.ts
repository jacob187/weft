/** Canvas helpers shared across templates. */

export interface FitOptions {
  /** Max device pixel ratio to render at. Default 2. Use 1 to match CSS pixels exactly. */
  maxDpr?: number;
  /** Size source. Default: the canvas's own CSS box. "window" uses innerWidth/innerHeight. */
  source?: 'element' | 'window';
  /** Called after every resize with CSS size and the applied ratio. */
  onResize?: (w: number, h: number, dpr: number) => void;
}

/**
 * Keep a canvas's backing store matched to its displayed size × DPR.
 * Returns a cleanup function.
 */
export function fitCanvas(canvas: HTMLCanvasElement, opts: FitOptions = {}): () => void {
  const { maxDpr = 2, source = 'element', onResize } = opts;
  const apply = () => {
    const dpr = Math.min(devicePixelRatio || 1, maxDpr);
    const w = source === 'window' ? innerWidth : canvas.clientWidth;
    const h = source === 'window' ? innerHeight : canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    onResize?.(w, h, dpr);
  };
  apply();
  if (source === 'window') {
    addEventListener('resize', apply);
    return () => removeEventListener('resize', apply);
  }
  const ro = new ResizeObserver(apply);
  ro.observe(canvas);
  return () => ro.disconnect();
}

export interface Loop {
  start(): void;
  stop(): void;
  readonly running: boolean;
}

/**
 * requestAnimationFrame loop that pauses while the tab is hidden.
 * `frame` receives the rAF timestamp (ms) and the delta since the last frame (s, clamped to 0.1).
 */
export function rafLoop(frame: (t: number, dt: number) => void): Loop {
  let id = 0;
  let last = 0;
  let running = false;
  const tick = (t: number) => {
    const dt = last ? Math.min((t - last) / 1000, 0.1) : 0;
    last = t;
    frame(t, dt);
    id = requestAnimationFrame(tick);
  };
  const loop: Loop = {
    start() {
      if (running) return;
      running = true;
      last = 0;
      id = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      cancelAnimationFrame(id);
    },
    get running() {
      return running;
    },
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(id);
    else if (running) {
      last = 0;
      id = requestAnimationFrame(tick);
    }
  });
  return loop;
}
