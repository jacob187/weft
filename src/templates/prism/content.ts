/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<a>/<br> only). */
export interface Link {
  label: string;
  href: string;
}

/** Accent color token a tinted element uses: `--mint`, `--vio`, `--rose` or `--amber`. */
export type Tone = 'mint' | 'vio' | 'rose' | 'amber';

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Wordmark text beside the prism logo mark in nav + footer. */
  brand: string;
  /** Top-bar text links; each href targets a section id. */
  nav: Link[];
  /** Pill button at the end of the top bar. */
  navCta: Link;
  hero: {
    /** `<em>` renders as the mint-to-rose gradient. */
    headingHtml: string;
    sub: string;
    primary: Link;
    secondary: Link;
    trust: string;
    /** The mock dashboard beside the headline. */
    dashboard: {
      balance: {
        label: string;
        currency: string;
        /** Whole-unit amount the counter animates up to (shown with thousands separators). */
        amount: number;
        /** Fixed fractional part including the dot, e.g. ".42". */
        cents: string;
        delta: string;
      };
      spending: {
        label: string;
        /** Total printed in the donut centre. */
        total: string;
        /** Small caption under the total. */
        caption: string;
        /** Segments in order; percentages should sum to 100. */
        categories: { name: string; percent: number; tone: Tone }[];
      };
      activity: {
        label: string;
        transactions: {
          /** Glyph in the tinted badge. */
          icon: string;
          tone: Tone;
          who: string;
          amount: string;
          /** Credits render in mint. */
          credit?: boolean;
        }[];
      };
    };
  };
  features: {
    id: string;
    kicker: string;
    /** `<em>` renders as a gradient. */
    headingHtml: string;
    items: { no: string; title: string; body: string; tone: Tone }[];
  };
  numbers: {
    id: string;
    kicker: string;
    /** `<em>` renders as a gradient. */
    headingHtml: string;
    stats: {
      /** Number the counter animates up to. */
      value: number;
      /** Suffix after the number, e.g. "s", "%", "px". */
      unit?: string;
      label: string;
      /** Render the number in mint. */
      highlight?: boolean;
    }[];
  };
  security: {
    id: string;
    kicker: string;
    /** `<em>` renders as a gradient. */
    headingHtml: string;
    /** Band headline; `<br>` allowed. */
    bandHeadingHtml: string;
    body: string;
    cta: Link;
  };
  footer: {
    note: string;
    /** Credit line above the showcase link (`<a>` allowed). */
    creditHtml?: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'PRISM — Banking, Refracted',
    description:
      'PRISM is a fictional bank for people who read the footnotes. Glass dashboards, honest numbers, zero dark patterns.',
    ogTitle: 'PRISM — Banking, Refracted',
    ogDescription: 'Glass dashboards, honest numbers, zero dark patterns.',
  },
  brand: 'PRISM',
  nav: [
    { label: 'Features', href: '#features' },
    { label: 'Numbers', href: '#numbers' },
    { label: 'Security', href: '#security' },
  ],
  navCta: { label: 'Open account', href: '#' },
  hero: {
    headingHtml: 'Your money,<br><em>refracted honestly.</em>',
    sub: "PRISM is a bank for people who read the footnotes. One clear balance, charts that don't lie with their y-axis, and fees printed in the same font size as everything else.",
    primary: { label: 'Open an account', href: '#' },
    secondary: { label: 'See it work', href: '#features' },
    trust: 'Fictional · FDIC-uninsured · Impeccably designed',
    dashboard: {
      balance: {
        label: 'Total balance',
        currency: '€',
        amount: 24618,
        cents: '.42',
        delta: '+2.4% this month',
      },
      spending: {
        label: 'Spending',
        total: '€2.9k',
        caption: 'THIS MONTH',
        categories: [
          { name: 'Home', percent: 38, tone: 'mint' },
          { name: 'Food', percent: 27, tone: 'vio' },
          { name: 'Travel', percent: 21, tone: 'rose' },
          { name: 'Vice', percent: 14, tone: 'amber' },
        ],
      },
      activity: {
        label: 'Activity',
        transactions: [
          { icon: '↓', tone: 'mint', who: 'Salary — Atelier Noir', amount: '+4,120.00', credit: true },
          { icon: '◱', tone: 'vio', who: 'Rent — Fjordgata 12', amount: '−1,480.00' },
          { icon: '✈', tone: 'rose', who: 'Flight — LOF→KYO', amount: '−612.40' },
          { icon: '☕', tone: 'amber', who: 'Coffee ×31', amount: '−117.80' },
        ],
      },
    },
  },
  features: {
    id: 'features',
    kicker: 'Why Prism',
    headingHtml: 'Banking with the <em>lights on.</em>',
    items: [
      {
        no: '01',
        title: 'Honest axes',
        body: "Every chart starts at zero unless you ask it not to. When a graph looks dramatic, it's because your month was.",
        tone: 'mint',
      },
      {
        no: '02',
        title: 'Fees in headline type',
        body: 'Our fee page uses the same 16-pixel font as our marketing page. Legal asked why. We asked why not.',
        tone: 'vio',
      },
      {
        no: '03',
        title: 'The 3am button',
        body: 'One tap freezes every card and wakes a human. No menu tree. Panic has terrible UX tolerance.',
        tone: 'rose',
      },
      {
        no: '04',
        title: 'Interest, itemised',
        body: 'See exactly which euro earned which cent. Compound interest is magic; magic deserves receipts.',
        tone: 'amber',
      },
    ],
  },
  numbers: {
    id: 'numbers',
    kicker: 'The Numbers',
    headingHtml: 'Counted <em>slowly,</em> printed plainly.',
    stats: [
      { value: 0, label: 'Hidden fees', highlight: true },
      { value: 3, unit: 's', label: 'To freeze a card' },
      { value: 100, unit: '%', label: 'Charts starting at zero' },
      { value: 16, unit: 'px', label: 'Fee-page font size' },
    ],
  },
  security: {
    id: 'security',
    kicker: 'Security',
    headingHtml: 'Boring, <em>by design.</em>',
    bandHeadingHtml: 'Your keys live in hardware.<br>Our promises live in writing.',
    body: 'Hardware security modules, independent audits published unredacted, and a security page written by engineers, not lawyers. We are thrilled to be the dullest part of your day.',
    cta: { label: 'Read the audit', href: '#' },
  },
  footer: {
    note: 'A fictional bank. Do not deposit anything except compliments.',
    creditHtml: 'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
};
