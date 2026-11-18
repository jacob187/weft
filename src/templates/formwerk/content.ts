/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<a>/<br>/<span> only). */
export interface Link {
  label: string;
  href: string;
}

/** Which geometric glyph illustrates a rule. */
export type RuleShape = 'circle' | 'bar' | 'triangle' | 'type';

export interface Rule {
  shape: RuleShape;
  /** Text drawn for the `type` shape (e.g. "Aa"); ignored by other shapes. */
  glyph?: string;
  title: string;
  text: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Wordmark next to the three-shape mark, in nav and footer. */
  brand: string;
  nav: Link[];
  hero: {
    /** The coloured full stops use `<span class="r|b|y">`. */
    headingHtml: string;
    subHtml: string;
  };
  /** The poster machine: copy for the controls and the inputs of the generator. */
  machine: {
    /** aria-label of the poster SVG. */
    posterLabel: string;
    newLabel: string;
    downloadLabel: string;
    /** Label before the live seed number. */
    seedLabel: string;
    /** Text before the keyboard-shortcut chip. */
    keyHintLabel: string;
    keyHintKey: string;
    /** Right-hand caption under the poster. */
    pressLabel: string;
    /** Seed shown on load. */
    initialSeed: number;
    /** Words one of which is set on each poster. */
    words: string[];
    /** Caption titles (a random one + number sign + 1–9 is shown under the poster). */
    titles: string[];
    /** Character placed before the 1–9 edition number in the caption. */
    numberSign: string;
    /** Metadata line printed on every poster: `${stampBefore}${seed padded to 4}${stampAfter}`. */
    stampBefore: string;
    stampAfter: string;
    /** Downloaded file name is `${downloadPrefix}-${seed padded to 4}.svg`. */
    downloadPrefix: string;
  };
  rules: {
    headingHtml: string;
    items: Rule[];
  };
  seeds: {
    headingHtml: string;
    /** Seeds rendered as clickable mini posters. */
    list: number[];
    /** Tooltip prefix for each mini poster: `${seedTitle} ${seed}`. */
    seedTitle: string;
    note: string;
  };
  footer: {
    noteHtml: string;
    creditHtml: string;
  };
  /** Showcase-only chrome; rendered when the template's `showcase` prop is true. */
  showcase?: {
    chipLabel: string;
    chipHref: string;
    footerHtml: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'FORMWERK — A Bauhaus Poster Machine',
    description:
      'FORMWERK generates Bauhaus-school posters from a seed: circle, bar, triangle, type. Pull the lever until it argues with you. Download what wins.',
    ogTitle: 'FORMWERK — A Bauhaus Poster Machine',
    ogDescription: 'Circle, bar, triangle, type. Pull the lever.',
  },
  brand: 'FORMWERK',
  nav: [
    { label: 'The Rules', href: '#rules' },
    { label: 'Good Seeds', href: '#seeds' },
  ],
  hero: {
    headingHtml:
      'Circle<span class="r">.</span> Bar<span class="b">.</span><br>Triangle<span class="y">.</span> Type<span class="r">.</span>',
    subHtml:
      'FORMWERK is a poster machine trained on one very strict art school. Every pull of the lever composes a new work from <b>four shapes, three colors, and one grid</b> — the same toolbox Weimar gave the twentieth century.',
  },
  machine: {
    posterLabel: 'Generated Bauhaus-style poster',
    newLabel: '⟳ New Poster',
    downloadLabel: '↓ Download SVG',
    seedLabel: 'Seed',
    keyHintLabel: 'or press',
    keyHintKey: 'SPACE',
    pressLabel: 'FORMWERK PRESS',
    initialSeed: 1204,
    words: ['BAU', 'FORM', 'WERK', 'TON', 'LICHT', 'RAUM', 'ZIG', 'NEU', 'KUNST', 'ACHT'],
    titles: ['AUSSTELLUNG', 'KABARETT', 'LICHTSPIEL', 'TYPOGRAFIE', 'KONZERT', 'WERKSCHAU'],
    numberSign: '№',
    stampBefore: 'FORMWERK · Nº',
    stampAfter: ' · 1923—∞',
    downloadPrefix: 'formwerk',
  },
  rules: {
    headingHtml: 'The machine obeys <em>four rules.</em>',
    items: [
      {
        shape: 'circle',
        title: 'One Dominant',
        text: 'Every poster gets exactly one boss — a shape big enough to argue with. Democracy is for the small elements.',
      },
      {
        shape: 'bar',
        title: 'The Diagonal Lives',
        text: 'At least one element tilts against the grid. Perfect order is for spreadsheets; posters need an argument.',
      },
      {
        shape: 'triangle',
        title: 'Three Colors, Ever',
        text: 'Red, blue, yellow — plus black and the paper. If it needs a fourth color, it needs a better composition instead.',
      },
      {
        shape: 'type',
        glyph: 'Aa',
        title: 'Type Is a Shape',
        text: 'Letters are geometry with opinions. The machine sets one word per poster and lets it collide with everything.',
      },
    ],
  },
  seeds: {
    headingHtml: 'Seeds the machine <em>is proud of.</em>',
    list: [112, 347, 589, 1204, 2718, 3141],
    seedTitle: 'Seed',
    note: 'Click any of these to load its seed into the big machine ↑',
  },
  footer: {
    noteHtml:
      'A fictional press with real opinions about triangles.<br>Every poster is generated in-browser as pure SVG.',
    creditHtml: 'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
  showcase: {
    chipLabel: '← Fable Showcase',
    chipHref: '/',
    footerHtml: 'Part of the <a href="/">Fable Showcase</a> — 25 sites, 25 styles.',
  },
};
