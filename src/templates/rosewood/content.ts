/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<a>/<br>/<span> only). */
export interface Link {
  label: string;
  href: string;
}

/** Line-art ornament drawn above a suite card. */
export type SuiteGlyph = 'fan' | 'chevron' | 'arch';

export interface Suite {
  /** Which Art Deco ornament to draw. */
  glyph: SuiteGlyph;
  name: string;
  /** Floor and size line, e.g. "Floor XII · 68 m²". */
  floor: string;
  description: string;
  /** Price line, shown in gold. */
  rate: string;
}

export interface Evening {
  /** Time and place, e.g. "19:00 — Lobby". */
  hour: string;
  name: string;
  description: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Hotel name in the nav and footer wordmark. */
  brand: string;
  /** Nav links (hidden below 900px). Hrefs target section ids. */
  nav: Link[];
  /** Labels the elevator dial cycles through as the page scrolls, lobby first. */
  floors: string[];
  hero: {
    /** Small line above the heading. */
    est: string;
    /** Heading; wrap the shimmering part in `<span class="gold">`. */
    headingHtml: string;
    sub: string;
    cta: Link;
    /** Line pinned to the bottom of the hero (desktop only). */
    foot: string;
  };
  suites: {
    /** Anchor id of the section (nav links target it). */
    id: string;
    kicker: string;
    headingHtml: string;
    items: Suite[];
  };
  evenings: {
    id: string;
    kicker: string;
    headingHtml: string;
    items: Evening[];
  };
  quote: {
    id: string;
    quoteHtml: string;
    cite: string;
  };
  footer: {
    /** Address / tagline under the footer wordmark. */
    noteHtml: string;
    /** Credit line; the showcase line is appended on showcase routes. */
    creditHtml: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'THE ROSEWOOD — An Art Deco Grand Hotel',
    description:
      'The Rosewood is a 1928 grand hotel, restored to the last brass rivet. Jazz in the lobby, gold leaf in the elevators, and the golden hour lasts all evening.',
    ogTitle: 'THE ROSEWOOD — An Art Deco Grand Hotel',
    ogDescription: 'Est. 1928. Restored to the last brass rivet.',
  },
  brand: 'THE ROSEWOOD',
  nav: [
    { label: 'Suites', href: '#suites' },
    { label: 'Evenings', href: '#evening' },
    { label: 'The House', href: '#quote' },
  ],
  floors: ['LOBBY', 'MEZZANINE', 'FLOOR III', 'FLOOR VI', 'FLOOR IX', 'FLOOR XII', 'THE PEACOCK'],
  hero: {
    est: 'Est. 1928 · Restored 2024',
    headingHtml: 'THE<br><span class="gold">ROSEWOOD</span>',
    sub: 'Fourteen storeys of emerald and brass on Fable Avenue. Jazz in the lobby at seven, gold leaf in the elevators always, and a doorman who has never once forgotten a name.',
    cta: { label: 'Reserve a suite', href: '#suites' },
    foot: 'Fable Avenue 1 · The Golden Hour lasts all evening',
  },
  suites: {
    id: 'suites',
    kicker: 'Suites & Rooms',
    headingHtml: 'Every floor, <em>a different decade.</em>',
    items: [
      {
        glyph: 'fan',
        name: 'The Gatsby',
        floor: 'Floor XII · 68 m²',
        description:
          'Corner suite with a private bar cart, a chaise that has heard things, and the city laid out like a promise.',
        rate: 'FROM $780 / NIGHT',
      },
      {
        glyph: 'chevron',
        name: 'The Aviatrix',
        floor: 'Floor IX · 52 m²',
        description:
          'Compass-rose parquet, a writing desk aimed at the skyline, and the deepest bathtub north of the equator.',
        rate: 'FROM $540 / NIGHT',
      },
      {
        glyph: 'arch',
        name: 'The Standard',
        floor: 'Floors II–VIII · 34 m²',
        description:
          '"Standard" by our 1928 charter only. Velvet drapes, brass fittings, breakfast brought up on the dumbwaiter.',
        rate: 'FROM $310 / NIGHT',
      },
    ],
  },
  evenings: {
    id: 'evening',
    kicker: 'The Evenings',
    headingHtml: 'After seven, the house <em>plays itself.</em>',
    items: [
      {
        hour: '19:00 — Lobby',
        name: 'The Quartet',
        description:
          'Four musicians, no setlist, requests accepted by napkin note. The pianist knows four hundred songs and refuses to prove it.',
      },
      {
        hour: '21:00 — Floor XIV',
        name: 'The Peacock Bar',
        description:
          "Cocktails from the 1928 ledger, poured under a ceiling of hand-laid gold fans. The Bee's Knees is non-negotiable.",
      },
      {
        hour: '23:00 — Basement',
        name: 'The Vault',
        description:
          'The old bank vault, now our listening room. One turntable, wax only, eleven seats. Silence between sides.',
      },
    ],
  },
  quote: {
    id: 'quote',
    quoteHtml:
      "“Other hotels give you a room. <em>The Rosewood gives you an alibi</em> — for wherever you'd rather have been all along.”",
    cite: '— Guest ledger, March 1931',
  },
  footer: {
    noteHtml: 'Fable Avenue 1 · A fictional grand hotel<br>The concierge answers before the second ring.',
    creditHtml: 'Original design by <a href="https://github.com/BrainwavePro">BrainwavePro</a>',
  },
};
