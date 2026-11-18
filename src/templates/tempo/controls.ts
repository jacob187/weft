import type { Synth } from './synth';

/** Cutoff readout: Hz shown as kHz with one decimal, e.g. "2.4kHz". */
export const formatCutoff = (hz: number, unit: string) => `${(hz / 1000).toFixed(1)}${unit}`;

/** Echo readout: whole percent, e.g. "25%". */
export const formatEcho = (pct: number, unit: string) => `${Math.round(pct)}${unit}`;

export interface KnobOptions {
  min: number;
  max: number;
  value: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

/** Rotary knob driven by vertical pointer drag or arrow keys; the mark sweeps -135° to +135°. */
export function knob(el: HTMLElement, out: HTMLElement, { min, max, value, format, onChange }: KnobOptions): void {
  let v = value;
  const mark = el.querySelector<HTMLElement>('.mark');
  const render = () => {
    const t = (v - min) / (max - min);
    if (mark) mark.style.transform = `translateX(-50%) rotate(${-135 + t * 270}deg)`;
    out.textContent = format(v);
    el.setAttribute('aria-valuenow', String(Math.round(v)));
  };
  const set = (next: number) => {
    v = Math.min(max, Math.max(min, next));
    render();
    onChange(v);
  };

  let dragging = false;
  let py = 0;
  el.addEventListener('pointerdown', (e) => {
    dragging = true;
    py = e.clientY;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dy = py - e.clientY;
    py = e.clientY;
    set(v + (dy * (max - min)) / 180);
  });
  el.addEventListener('pointerup', () => {
    dragging = false;
  });
  el.addEventListener('keydown', (e) => {
    const step = (max - min) / 24;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') set(v + step);
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') set(v - step);
  });
  render();
}

/** Waveform selector: clicking a `.wv[data-w]` button marks it `.on` and sets the synth's oscillator type. */
export function waveButtons(buttons: NodeListOf<HTMLButtonElement>, synth: Synth): void {
  buttons.forEach((b) => {
    b.addEventListener('click', () => {
      buttons.forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      synth.wave = b.dataset.w as OscillatorType;
    });
  });
}
