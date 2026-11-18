interface Voice {
  osc: OscillatorNode;
  gain: GainNode;
}

/** Audio nodes that exist only once the context has been created. */
interface Graph {
  ctx: AudioContext;
  filter: BiquadFilterNode;
  delayGain: GainNode;
  analyser: AnalyserNode;
}

/**
 * Polyphonic subtractive synth: oscillator voices → lowpass filter → [dry, feedback delay] → master → analyser → out.
 * The AudioContext is created (and resumed) only from `noteOn`, which callers invoke from a user gesture.
 */
export class Synth {
  wave: OscillatorType;
  cutoff: number;
  delayMix: number;
  private graph: Graph | null = null;
  private voices = new Map<string, Voice>();

  constructor(wave: OscillatorType, cutoff: number, delayMix: number) {
    this.wave = wave;
    this.cutoff = cutoff;
    this.delayMix = delayMix;
  }

  /** Analyser feeding the oscilloscope; null until the first note. */
  get analyser(): AnalyserNode | null {
    return this.graph?.analyser ?? null;
  }

  private ensure(): Graph {
    if (this.graph) return this.graph;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.5;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = this.cutoff;
    filter.Q.value = 0.9;
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.28;
    const delayGain = ctx.createGain();
    delayGain.gain.value = this.delayMix;
    const fb = ctx.createGain();
    fb.gain.value = 0.34;
    const dryGain = ctx.createGain();
    dryGain.gain.value = 1;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    // graph: voices → filter → [dry, delay] → master → analyser → out
    filter.connect(dryGain);
    dryGain.connect(master);
    filter.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(master);
    delay.connect(fb);
    fb.connect(delay);
    master.connect(analyser);
    analyser.connect(ctx.destination);
    this.graph = { ctx, filter, delayGain, analyser };
    return this.graph;
  }

  noteOn(freq: number, id: string): void {
    const { ctx, filter } = this.ensure();
    if (ctx.state === 'suspended') void ctx.resume();
    if (this.voices.has(id)) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = this.wave;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.012);
    osc.connect(gain);
    gain.connect(filter);
    osc.start();
    this.voices.set(id, { osc, gain });
  }

  noteOff(id: string): void {
    const v = this.voices.get(id);
    if (!v || !this.graph) return;
    const t = this.graph.ctx.currentTime;
    v.gain.gain.cancelScheduledValues(t);
    v.gain.gain.setValueAtTime(v.gain.gain.value, t);
    v.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    v.osc.stop(t + 0.35);
    this.voices.delete(id);
  }

  /** Filter cutoff in Hz. */
  setCutoff(hz: number): void {
    this.cutoff = hz;
    if (this.graph) this.graph.filter.frequency.setTargetAtTime(hz, this.graph.ctx.currentTime, 0.02);
  }

  /** Echo send level, 0–1. */
  setDelayMix(mix: number): void {
    this.delayMix = mix;
    if (this.graph) this.graph.delayGain.gain.setTargetAtTime(mix, this.graph.ctx.currentTime, 0.02);
  }
}
