/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<br>/<span>/<a> only). */
export interface Link {
  label: string;
  href: string;
}

/** A machined finish: drives both the swatch button and the live 3D material. */
export interface Finish {
  /** Unique key (button `data-fin`). The first finish is the default. */
  id: string;
  /** Label under the swatch. */
  name: string;
  /** CSS `background` for the round swatch dot (color or gradient). */
  dot: string;
  /** Base metal color of the 3D model (any CSS color). */
  color: string;
  metalness: number;
  roughness: number;
  /** Color of the glowing core line inside the helix. Defaults to the `--amber` token. */
  accent?: string;
}

export interface SpecRow {
  label: string;
  /** Value; may contain `<i>` for accent-colored fragments. */
  valueHtml: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Wordmark in the nav and footer; wrap the accented separator in `<span>`. */
  brandHtml: string;
  /** Nav links before the call-to-action pill. */
  nav: Link[];
  /** Pill-shaped nav call to action. */
  navCta: Link;
  /** Accessible description of the 3D canvas. */
  stageLabel: string;
  hero: {
    /** Anchor id of the hero section. */
    id: string;
    kicker: string;
    title: string;
    sub: string;
    cta: Link;
    price: string;
    /** Small line under the price. */
    priceNote: string;
    /** Hint at the bottom of the hero (desktop only). */
    scrollCue: string;
  };
  design: {
    id: string;
    kicker: string;
    headingHtml: string;
    bodyHtml: string;
    specs: SpecRow[];
  };
  finishes: {
    id: string;
    kicker: string;
    headingHtml: string;
    body: string;
    /** Accessible label of the swatch group. */
    groupLabel: string;
    options: Finish[];
  };
  preorder: {
    id: string;
    kicker: string;
    headingHtml: string;
    body: string;
    cta: Link;
  };
  footer: {
    noteHtml: string;
    /** Credit line; the showcase line is appended on showcase routes. */
    creditHtml: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'HELIX ONE — An Audio Sculpture',
    description:
      'HELIX ONE is a loudspeaker that refuses to look like one. Real-time 3D, three finishes, machined from a single billet.',
    ogTitle: 'HELIX ONE — An Audio Sculpture',
    ogDescription: 'A loudspeaker that refuses to look like one. Explore it in live 3D.',
  },
  brandHtml: 'HELIX<span>·</span>AUDIO',
  nav: [
    { label: 'Design', href: '#design' },
    { label: 'Finishes', href: '#finish' },
  ],
  navCta: { label: 'Pre-order', href: '#preorder' },
  stageLabel: 'Interactive 3D view of the HELIX ONE audio sculpture',
  hero: {
    id: 'top',
    kicker: 'Helix Audio · 001',
    title: 'HELIX ONE',
    sub: "A loudspeaker that refuses to look like one. Machined from a single billet, tuned in an anechoic chamber, and — as you can see — allergic to standing still. Drag it. It doesn't mind.",
    cta: { label: 'Pre-order', href: '#preorder' },
    price: '$4,800',
    priceNote: "Ships Spring '27",
    scrollCue: 'Scroll — the sculpture follows',
  },
  design: {
    id: 'design',
    kicker: 'Engineering',
    headingHtml: 'One curve,<br>zero cabinets.',
    bodyHtml:
      'The helical horn is the speaker. Sound travels the full length of the curve, emerging phase-aligned with <b>no enclosure resonance</b> — because there is no enclosure.',
    specs: [
      { label: 'Driver', valueHtml: 'Full-range 94dB <i>·</i> field-coil' },
      { label: 'Response', valueHtml: '32Hz — 24kHz' },
      { label: 'Body', valueHtml: '6061 billet, 41 hrs CNC' },
      { label: 'Mass', valueHtml: '18.2 kg' },
      { label: 'Feedback', valueHtml: '<i>None. On principle.</i>' },
    ],
  },
  finishes: {
    id: 'finish',
    kicker: 'Finishes',
    headingHtml: 'Three moods,<br>machined.',
    body: 'Anodised in-house, one sculpture at a time. Tap a finish — the model updates live.',
    groupLabel: 'Finish selector',
    options: [
      {
        id: 'graphite',
        name: 'Graphite',
        dot: '#3a3d42',
        color: '#3a3d42',
        metalness: 0.92,
        roughness: 0.32,
      },
      {
        id: 'chrome',
        name: 'Chrome',
        dot: 'linear-gradient(135deg,#f4f6f9,#8f96a1)',
        color: '#d7dce3',
        metalness: 1,
        roughness: 0.12,
        accent: '#9aa2ad',
      },
      {
        id: 'brass',
        name: 'Brass',
        dot: 'linear-gradient(135deg,#f0c470,#a8722a)',
        color: '#cf9a48',
        metalness: 0.95,
        roughness: 0.24,
        accent: '#f0c470',
      },
    ],
  },
  preorder: {
    id: 'preorder',
    kicker: 'Edition of 500',
    headingHtml: 'Yours, eventually.',
    body: 'Each HELIX ONE is machined to order and signed by the engineer who tuned it. The waitlist is long. The speaker is longer-lived. A fictional product, tragically.',
    cta: { label: 'Join the waitlist', href: '#top' },
  },
  footer: {
    noteHtml: 'A fictional audio marque.<br>Rendered live in WebGL — no product photography involved.',
    creditHtml: 'Original design by <a href="https://github.com/BrainwavePro">BrainwavePro</a>',
  },
};
