/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<br>/<a>/<i> only). */
export interface Link {
  label: string;
  href: string;
}

/** A playable note bound to a computer-keyboard key. */
export interface Note {
  /** Scientific pitch name shown in the readout, e.g. "C#4". */
  name: string;
  /** Frequency in Hz. */
  freq: number;
  /** Computer-keyboard key that plays it (also printed on the key). */
  key: string;
}

/** A sharp/flat key drawn over the gap between two white keys. */
export interface BlackNote extends Note {
  /** Index of the white key just left of this black key. */
  after: number;
}

export interface KnobContent {
  /** Caption under the knob. */
  label: string;
  /** aria-label of the slider. */
  ariaLabel: string;
  min: number;
  max: number;
  /** Initial value. */
  value: number;
  /** Unit printed after the readout number (e.g. "kHz", "%"). */
  unit: string;
}

export interface Waveform {
  /** Button label, e.g. "SAW". */
  label: string;
  /** Web Audio oscillator type. */
  type: OscillatorType;
}

export interface Spec {
  title: string;
  body: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Logo in nav + footer; wrap the accented letter in <i>. */
  logoHtml: string;
  nav: Link[];
  hero: {
    headingHtml: string;
    subHtml: string;
  };
  synth: {
    /** Filter cutoff knob (Hz, drives the lowpass filter). Readout is shown in kHz. */
    cutoff: KnobContent;
    /** Echo mix knob (0–100, drives the delay send level). */
    echo: KnobContent;
    waveforms: Waveform[];
    /** Waveform selected at load; must be one of `waveforms[].type`. */
    defaultWave: OscillatorType;
    keys: {
      white: Note[];
      black: BlackNote[];
    };
    /** Status line under the keys. */
    status: {
      ready: string;
      model: string;
      /** Last-played-note readout before any key is pressed. */
      idleNote: string;
    };
    hintHtml: string;
  };
  engine: {
    id: string;
    kicker: string;
    headingHtml: string;
    specs: Spec[];
  };
  why: {
    id: string;
    kicker: string;
    headingHtml: string;
    body: string;
  };
  footer: {
    noteHtml: string;
    creditHtml: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'TEMPO — A Synth That Lives in Your Browser',
    description:
      'TEMPO is a playable Web Audio synthesizer. Real oscillators, a real filter, a real oscilloscope — press A through K and make some noise.',
    ogTitle: 'TEMPO — A Synth That Lives in Your Browser',
    ogDescription: 'Press A through K. Make some noise.',
  },
  logoHtml: 'TEMP<i>O</i>',
  nav: [
    { label: 'Engine', href: '#engine' },
    { label: 'Why', href: '#why' },
  ],
  hero: {
    headingHtml: 'This page is <em>an instrument.</em>',
    subHtml:
      'Real oscillators. A real filter. A real oscilloscope.<br><b>Click the keys or type A–K.</b> Turn it up.',
  },
  synth: {
    cutoff: { label: 'Cutoff', ariaLabel: 'Filter cutoff', min: 100, max: 9000, value: 2400, unit: 'kHz' },
    echo: { label: 'Echo', ariaLabel: 'Delay mix', min: 0, max: 100, value: 25, unit: '%' },
    waveforms: [
      { label: 'SAW', type: 'sawtooth' },
      { label: 'SQR', type: 'square' },
      { label: 'SIN', type: 'sine' },
    ],
    defaultWave: 'sawtooth',
    keys: {
      white: [
        { name: 'C4', freq: 261.63, key: 'A' },
        { name: 'D4', freq: 293.66, key: 'S' },
        { name: 'E4', freq: 329.63, key: 'D' },
        { name: 'F4', freq: 349.23, key: 'F' },
        { name: 'G4', freq: 392.0, key: 'G' },
        { name: 'A4', freq: 440.0, key: 'H' },
        { name: 'B4', freq: 493.88, key: 'J' },
        { name: 'C5', freq: 523.25, key: 'K' },
      ],
      black: [
        { name: 'C#4', freq: 277.18, key: 'W', after: 0 },
        { name: 'D#4', freq: 311.13, key: 'E', after: 1 },
        { name: 'F#4', freq: 369.99, key: 'T', after: 3 },
        { name: 'G#4', freq: 415.3, key: 'Y', after: 4 },
        { name: 'A#4', freq: 466.16, key: 'U', after: 5 },
      ],
    },
    status: {
      ready: 'ENGINE READY',
      model: 'TEMPO MK-1 · POLYPHONIC · WEB AUDIO',
      idleNote: '—',
    },
    hintHtml: 'headphones recommended · neighbors optional · <b>A S D F G H J K</b> are the white keys',
  },
  engine: {
    id: 'engine',
    kicker: 'The Engine',
    headingHtml: 'No samples. No plugins.<br><em>Just the browser,</em> oscillating.',
    specs: [
      {
        title: 'OSC → FILTER → ECHO',
        body: 'Each key spawns a fresh oscillator through a lowpass filter into a feedback delay. The whole signal chain is ~40 lines of Web Audio API.',
      },
      {
        title: 'THE SCOPE IS LIVE',
        body: 'That waveform isn\'t a looping GIF — it\'s an AnalyserNode reading 2,048 samples of whatever you\'re playing, sixty times a second.',
      },
      {
        title: 'POLYPHONY: YES',
        body: 'Mash as many keys as you have fingers. Each voice gets its own envelope and a polite 300ms release so chords bloom instead of click.',
      },
      {
        title: 'LATENCY: HONEST',
        body: 'A few milliseconds, straight from your keystroke to your speakers. Faster than some hardware we won\'t name.',
      },
    ],
  },
  why: {
    id: 'why',
    kicker: 'Why',
    headingHtml: 'Because the browser is <em>a studio</em><br>wearing a document\'s clothes.',
    body: 'TEMPO exists to prove a point in this showcase: a webpage can be a working instrument — synthesis, filtering, visualization — with zero dependencies and one file. If you got this far without playing a note, scroll back up. The keys miss you.',
  },
  footer: {
    noteHtml: 'A fictional instrument that genuinely works.<br>May contain frequencies.',
    creditHtml: 'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
};
