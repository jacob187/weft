/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<span>/<br>/<a> only). */
export interface Link {
  label: string;
  href: string;
}

/** Illustration drawn into a manuscript panel by panels.ts. */
export type PanelKind = 'beast' | 'hours' | 'map';

export interface Manuscript {
  panel: PanelKind;
  title: string;
  /** Italic line under the title, e.g. "c. 1211 · Canterbury". */
  date: string;
  text: string;
  /** Latin caption written inside the illustration. */
  caption: string;
  /** Extra inscription inside the illustration (used by `hours` and `map`). */
  label?: string;
}

export interface Step {
  /** Roman numeral, e.g. "i.". */
  no: string;
  title: string;
  text: string;
}

/** A handwritten note in the folio's margin. Offsets are CSS lengths. */
export interface Marginalia {
  textHtml: string;
  /** Which side of the folio it hangs off. */
  side: 'left' | 'right';
  /** Distance outside that side, e.g. "-170px". */
  offset: string;
  /** Vertical position: set exactly one of `top` / `bottom`, e.g. "30%". */
  top?: string;
  bottom?: string;
  /** Tilt in degrees. Default -4. */
  rotate?: number;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Wordmark in nav + footer, e.g. `CODE<b>X</b>`. */
  wordmarkHtml: string;
  nav: Link[];
  hero: {
    /** Red italic line above the title. */
    rubric: string;
    /** Title; the gold animated drop-cap is `<span class="init">C</span>`. */
    headingHtml: string;
    subHtml: string;
    /** Small italic line under the intro. */
    folioFoot: string;
    marginalia: Marginalia[];
  };
  collection: {
    kicker: string;
    headingHtml: string;
    manuscripts: Manuscript[];
  };
  scriptorium: {
    kicker: string;
    headingHtml: string;
    steps: Step[];
  };
  visit: {
    kicker: string;
    headingHtml: string;
    bodyHtml: string;
    /** Letter pressed into the wax seal. */
    seal: string;
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
    title: 'CODEX — A Library of Illuminated Manuscripts',
    description:
      'CODEX keeps eleven illuminated manuscripts and one very good story about each. Gold leaf, indigo ink, and marginalia by monks who were extremely bored.',
    ogTitle: 'CODEX — A Library of Illuminated Manuscripts',
    ogDescription: 'Gold leaf, indigo ink, and very bored monks.',
  },
  wordmarkHtml: 'CODE<b>X</b>',
  nav: [
    { label: 'The Collection', href: '#collection' },
    { label: 'The Scriptorium', href: '#scriptorium' },
    { label: 'Visit', href: '#visit' },
  ],
  hero: {
    rubric: '¶ Here beginneth the library',
    headingHtml: '<span class="init">C</span>ODEX —<br>eleven books,<br>eight hundred years.',
    subHtml:
      'A reading room for manuscripts written by hand, gilded by candlelight, and doodled upon by <b>monks with wandering minds</b>. The gold on this page moves because real gold leaf never sits still either.',
    folioFoot: 'ANNO MMXXVI · FOLIO I',
    marginalia: [
      {
        textHtml: 'the initial is<br>genuinely animated,<br>look closer ↖',
        side: 'right',
        offset: '-170px',
        top: '30%',
      },
      {
        textHtml: 'a monk drew a snail<br>fighting a knight here.<br>we kept it. obviously.',
        side: 'left',
        offset: '-165px',
        bottom: '22%',
        rotate: 3,
      },
    ],
  },
  collection: {
    kicker: '¶ The Collection, abridged',
    headingHtml: 'Three folios of <span class="gold">particular renown.</span>',
    manuscripts: [
      {
        panel: 'beast',
        title: 'The Bestiary of Improbable Beasts',
        date: 'c. 1211 · Canterbury',
        text: 'Ninety-four animals, eleven of which exist. The illuminator had heard of, but never seen, an elephant. His attempt has four knees and an apology in Latin.',
        caption: 'elephantus (paenitet)',
      },
      {
        panel: 'hours',
        title: 'The Hours of the Unfinished Sky',
        date: 'c. 1348 · Bruges',
        text: 'A book of hours whose final skies were never filled in — the workshop\'s blue, ground lapis, ran out mid-heaven. The blank vellum is somehow bluer.',
        caption: 'caelum imperfectum',
        label: 'out of blue —',
      },
      {
        panel: 'map',
        title: 'The Mappa of Confident Errors',
        date: 'c. 1420 · Genoa',
        text: 'A world map that is wrong about every coastline and right about one thing: "HIC SUNT DRACONES" is written where the cartographer\'s mother-in-law lived.',
        caption: 'orbis terrarum (fere)',
        label: 'HIC SUNT DRACONES',
      },
    ],
  },
  scriptorium: {
    kicker: '¶ The Scriptorium',
    headingHtml: 'How a page took a season.',
    steps: [
      {
        no: 'i.',
        title: 'The Vellum',
        text: 'One calf, one bifolium. Scraped, stretched, and chalked for a fortnight until it forgave you.',
      },
      {
        no: 'ii.',
        title: 'The Ink',
        text: 'Oak galls, iron salts, rainwater, wine. The recipe reads like a curse and keeps for eight centuries.',
      },
      {
        no: 'iii.',
        title: 'The Gold',
        text: 'Leaf beaten thinner than a held breath, laid on gesso, burnished with a wolf\'s tooth until it caught the candle.',
      },
      {
        no: 'iv.',
        title: 'The Margins',
        text: 'Officially: decoration. Unofficially: rabbits with swords, complaints about the cold, and one immortal "this parchment is hairy."',
      },
    ],
  },
  visit: {
    kicker: '¶ Visitation',
    headingHtml: 'The reading room seats <span class="gold">nine.</span>',
    bodyHtml:
      'Cotton gloves are provided; awe is assumed. Book a desk by letter or in person — <b>the Codex Library, Vellum Lane 3</b> — and a librarian will bring you one manuscript, one foam cradle, and zero pens. Pencils only. The monks would have understood.',
    seal: 'C',
  },
  footer: {
    noteHtml: 'A fictional library of plausible books.<br>All illuminations rendered in code, no calves harmed.',
    creditHtml: 'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
  showcase: {
    chipLabel: '← Fable Showcase',
    chipHref: '/',
    footerHtml: 'Part of the <a href="/">Fable Showcase</a> — 25 sites, 25 styles.',
  },
};
