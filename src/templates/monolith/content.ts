/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<br>/<a>/<span>/<sup> only). */
export interface Link {
  label: string;
  href: string;
}

/**
 * Specimen look for a catalog row's name, set in CSS with variable-font axes:
 * brute = wide black, narrow = condensed, bone = hairline, slab = wide italic, mono = monospace.
 */
export type FamilyLook = 'brute' | 'narrow' | 'bone' | 'slab' | 'mono';

export interface Family {
  look: FamilyLook;
  name: string;
  /** Three meta chips under the name (e.g. "18 styles", "Variable", "2024"). */
  meta: [string, string, string];
}

/** A range input of the type tester. */
export interface Slider {
  label: string;
  min: number;
  max: number;
  value: number;
}

export interface Fact {
  /** Counts up from 0 when scrolled into view. */
  value: number;
  label: string;
}

export interface Plan {
  name: string;
  price: string;
  /** Small suffix after the price, e.g. "/ STYLE". */
  unit: string;
  features: string[];
  cta: Link;
  /** Marks the plan as the featured one (inverted colors) and shows this badge. */
  badge?: string;
}

export interface SectionHead {
  title: string;
  /** Mono index at the right of the sticky section header. */
  idx: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Logo in the top bar; the <sup> is tinted red. */
  logoHtml: string;
  /** Messages cycling every 4.2s in the top bar (the first shows initially). Hidden below 900px. */
  ticker: string[];
  /** Section anchors available: #catalog, #tester, #license. */
  nav: Link[];
  hero: {
    /** The two giant lines; the second is red. */
    line1: string;
    line2: string;
    ariaLabel: string;
    hint: string;
    meta: { label: string; value: string }[];
  };
  /** Items of the inverted ticker band; the dot separators are added automatically. */
  marquee: string[];
  catalog: { head: SectionHead; families: Family[]; specimenLabel: string };
  tester: {
    head: SectionHead;
    /** Initial editable text. */
    text: string;
    width: Slider;
    weight: Slider;
    size: Slider;
    noteHtml: string;
  };
  facts: Fact[];
  license: { head: SectionHead; plans: Plan[] };
  footer: {
    giantHtml: string;
    addressHtml: string;
    creditHtml: string;
  };
  /** Showcase-only chrome; rendered only when the Template receives `showcase`. */
  showcase?: { chipLabel: string; chipHref: string; footerHtml: string };
}

export const demo: Content = {
  seo: {
    title: 'MONOLITH® Type Foundry',
    description: 'MONOLITH is a brutalist type foundry. Fourteen families. Two hundred twelve styles. Zero apologies.',
    ogTitle: 'MONOLITH® Type Foundry',
    ogDescription: 'Fourteen families. Two hundred twelve styles. Zero apologies.',
  },
  logoHtml: 'MONOLITH<sup>®</sup>',
  ticker: [
    'TYPE IS A LOAD-BEARING WALL — TREAT IT ACCORDINGLY',
    'KERNING IS A CIVIC DUTY',
    'YOUR BRAND DOES NOT NEED A SCRIPT FONT',
    'WHITESPACE IS NOT EMPTY. IT IS STRUCTURE',
  ],
  nav: [
    { label: 'Catalog', href: '#catalog' },
    { label: 'Tester', href: '#tester' },
    { label: 'License', href: '#license' },
  ],
  hero: {
    line1: 'MONO',
    line2: 'LITH',
    ariaLabel: 'MONOLITH type foundry',
    hint: 'Move cursor · X = width · Y = weight',
    meta: [
      { label: 'Foundry', value: 'EST. 2019' },
      { label: 'Families', value: '14' },
      { label: 'Styles', value: '212' },
      { label: 'Apologies', value: '0' },
    ],
  },
  marquee: [
    'New release — BRUTE Condensed',
    'Variable axes: WDTH 50–150',
    'No trials. No refunds. No serifs',
  ],
  catalog: {
    head: { title: 'The Catalog', idx: '01 / FAMILIES' },
    specimenLabel: 'SPECIMEN ↗',
    families: [
      { look: 'brute', name: 'Brute', meta: ['18 styles', 'Variable', '2024'] },
      { look: 'narrow', name: 'Sliver', meta: ['9 styles', 'Condensed', '2023'] },
      { look: 'bone', name: 'Bonework', meta: ['12 styles', 'Hairline–Black', '2022'] },
      { look: 'slab', name: 'Slab Nine', meta: ['26 styles', 'Italic included', '2021'] },
      { look: 'mono', name: 'Terminal_88', meta: ['4 styles', 'Monospace', '2019'] },
    ],
  },
  tester: {
    head: { title: 'Type Tester', idx: '02 / TOUCH IT' },
    text: 'Grids are a moral position.',
    width: { label: 'Width', min: 50, max: 150, value: 120 },
    weight: { label: 'Weight', min: 100, max: 900, value: 700 },
    size: { label: 'Size', min: 24, max: 160, value: 96 },
    noteHtml: 'Click the text to edit it.<br>This is <b>BRUTE VARIABLE</b> — one file, a hundred widths, no excuses.',
  },
  facts: [
    { value: 14, label: 'Families in catalog' },
    { value: 212, label: 'Styles shipped' },
    { value: 61, label: 'Countries licensed' },
    { value: 3, label: 'Fonts we regret' },
  ],
  license: {
    head: { title: 'Licensing', idx: '03 / PAY ONCE' },
    plans: [
      {
        name: 'Desktop',
        price: '€90',
        unit: '/ STYLE',
        features: ['Print + logo use', '2 workstations', 'All weights forever', 'Updates included'],
        cta: { label: 'Buy Desktop', href: '#' },
      },
      {
        name: 'Everything',
        price: '€480',
        unit: '/ FAMILY',
        features: [
          'Desktop + Web + App',
          'Unlimited domains',
          'Variable file included',
          'Broadcast + social',
          'Our undying respect',
        ],
        cta: { label: 'Buy Everything', href: '#' },
        badge: 'Most bought',
      },
      {
        name: 'Web',
        price: '€140',
        unit: '/ STYLE',
        features: ['Self-host WOFF2', '1M pageviews / mo', 'Subsetting allowed', 'No CDN lock-in'],
        cta: { label: 'Buy Web', href: '#' },
      },
    ],
  },
  footer: {
    giantHtml: 'SET IT <span>SOLID.</span>',
    addressHtml: 'MONOLITH® TYPE FOUNDRY<br>KÖPENICKER STR. 48, BERLIN<br>A FICTIONAL FOUNDRY.',
    creditHtml: 'ORIGINAL DESIGN BY <a href="https://github.com/BrainwavePro">BRAINWAVEPRO</a>',
  },
  showcase: {
    chipLabel: '← Weft',
    chipHref: '/',
    footerHtml: 'PART OF <a href="/">WEFT</a> — 25 SITES, 25 STYLES.',
  },
};
