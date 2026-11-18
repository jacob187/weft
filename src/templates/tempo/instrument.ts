import { formatCutoff, formatEcho, knob, waveButtons } from './controls';
import { keyboard } from './keyboard';
import { scope } from './scope';
import { Synth } from './synth';

/**
 * Wire up the instrument markup under `root` (`#synth`): synth engine, keys, knobs, waveform buttons, scope.
 * Knob ranges and units come from the knobs' aria/`data-*` attributes, the default waveform from the `.wv.on` button.
 * No audio context exists until the first key press.
 */
export function initInstrument(root: HTMLElement): void {
  const cutKnob = root.querySelector<HTMLElement>('#cutKnob');
  const cutOut = root.querySelector<HTMLElement>('#cutOut');
  const delKnob = root.querySelector<HTMLElement>('#delKnob');
  const delOut = root.querySelector<HTMLElement>('#delOut');
  const keys = root.querySelector<HTMLElement>('#keys');
  const noteRead = root.querySelector<HTMLElement>('#noteRead');
  const scopeEl = root.querySelector<HTMLCanvasElement>('#scope');
  const waves = root.querySelectorAll<HTMLButtonElement>('.wv');
  if (!cutKnob || !cutOut || !delKnob || !delOut || !keys || !noteRead || !scopeEl) return;

  const on = root.querySelector<HTMLButtonElement>('.wv.on');
  const cut = knobConfig(cutKnob);
  const del = knobConfig(delKnob);
  const synth = new Synth((on?.dataset.w ?? 'sawtooth') as OscillatorType, cut.value, del.value / 100);

  keyboard(keys, synth, noteRead);
  waveButtons(waves, synth);
  knob(cutKnob, cutOut, { ...cut, format: (v) => formatCutoff(v, cut.unit), onChange: (v) => synth.setCutoff(v) });
  knob(delKnob, delOut, { ...del, format: (v) => formatEcho(v, del.unit), onChange: (v) => synth.setDelayMix(v / 100) });
  scope(scopeEl, synth);
}

function knobConfig(el: HTMLElement) {
  return {
    min: Number(el.getAttribute('aria-valuemin')),
    max: Number(el.getAttribute('aria-valuemax')),
    value: Number(el.dataset.value),
    unit: el.dataset.unit ?? '',
  };
}
