import type { Synth } from './synth';

/**
 * Make every `.key` under `root` playable by pointer and by its computer-keyboard key.
 * Each key carries `data-note`, `data-freq` and `data-key`; `readout` shows the last note played.
 * Notes start the audio context, so they must only trigger from user gestures (pointer/key events).
 */
export function keyboard(root: HTMLElement, synth: Synth, readout: HTMLElement): void {
  const byKey = new Map<string, { el: HTMLElement; freq: number; name: string }>();

  const press = (el: HTMLElement, freq: number, name: string) => {
    synth.noteOn(freq, name);
    el.classList.add('down');
    readout.textContent = name;
  };
  const release = (el: HTMLElement, name: string) => {
    synth.noteOff(name);
    el.classList.remove('down');
  };

  root.querySelectorAll<HTMLElement>('.key').forEach((el) => {
    const name = el.dataset.note ?? '';
    const freq = Number(el.dataset.freq);
    byKey.set((el.dataset.key ?? '').toUpperCase(), { el, freq, name });
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      press(el, freq, name);
    });
    el.addEventListener('pointerup', () => release(el, name));
    el.addEventListener('pointerleave', () => release(el, name));
  });

  addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const k = byKey.get(e.key.toUpperCase());
    if (k) press(k.el, k.freq, k.name);
  });
  addEventListener('keyup', (e) => {
    const k = byKey.get(e.key.toUpperCase());
    if (k) release(k.el, k.name);
  });
}
