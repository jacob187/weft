/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<br>/<a>/<span> only). */
export interface Link {
  label: string;
  href: string;
}

/** Dial finishes the watch renderer knows; each maps to `--dial-<id>-*` tokens in theme.css. */
export type DialId = 'obsidian' | 'meteor' | 'forest';

export interface CraftItem {
  /** Small italic index, e.g. "01 — Movement". */
  num: string;
  title: string;
  /** When true, the live local time (e.g. "10:08 AM") is appended to the title. */
  clock?: boolean;
  text: string;
}

export interface Watch {
  /** Dial finish. */
  dial: DialId;
  name: string;
  /** Reference line under the name. */
  ref: string;
  price: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Brand wordmark in the nav and footer; the <em> is tinted gold. */
  wordmarkHtml: string;
  /** Section anchors available: #craft, #collection, #manifesto, #atelier. Nav is hidden below 900px. */
  nav: Link[];
  hero: {
    /** Wrap the shimmering gold word in `<span class="gold">`. */
    headingHtml: string;
    body: string;
    cta: Link;
    /** Label of the animated scroll cue at the bottom. */
    scrollLabel: string;
  };
  /** Items of the scrolling ticker; the middle dot separators are added automatically. */
  marquee: string[];
  craft: {
    kicker: string;
    headingHtml: string;
    /** Four items: the first two render left of the live watch, the rest right. */
    items: CraftItem[];
  };
  /** Text printed on every watch dial. */
  dial: { brand: string; place: string };
  collection: {
    kicker: string;
    headingHtml: string;
    /** Label revealed on card hover. */
    enquireLabel: string;
    watches: Watch[];
  };
  manifesto: { quoteHtml: string; cite: string };
  specs: {
    kicker: string;
    headingHtml: string;
    rows: { label: string; valueHtml: string }[];
  };
  footer: {
    addressHtml: string;
    creditHtml: string;
  };
  /** Showcase-only chrome; rendered only when the Template receives `showcase`. */
  showcase?: { chipLabel: string; chipHref: string; footerHtml: string };
}

export const demo: Content = {
  seo: {
    title: 'OBSIDIAN — Haute Horlogerie',
    description:
      'OBSIDIAN. Thirty-eight watches a year, poured in gold. A study in molten light and mechanical patience.',
    ogTitle: 'OBSIDIAN — Haute Horlogerie',
    ogDescription: 'Time, poured in gold. A raymarched WebGL study in molten light.',
  },
  wordmarkHtml: 'OBSIDI<em>A</em>N',
  nav: [
    { label: 'Craft', href: '#craft' },
    { label: 'Collection', href: '#collection' },
    { label: 'Manifesto', href: '#manifesto' },
    { label: 'Atelier', href: '#atelier' },
  ],
  hero: {
    headingHtml: 'Time,<br>poured in <span class="gold">gold.</span>',
    body: 'Thirty-eight watches leave our Geneva atelier each year. Each case is cast from a single pour of 18-karat gold, cooled for nine days, and finished under a loupe for two hundred hours.',
    cta: { label: 'View the collection', href: '#collection' },
    scrollLabel: 'Scroll',
  },
  marquee: ['Geneva', 'Hand-finished', 'Calibre OB-9', 'Thirty-eight pieces a year', 'Est. 1911'],
  craft: {
    kicker: 'The Craft',
    headingHtml: 'Nine days to cool.<br><em>Two hundred hours</em> to finish.',
    items: [
      {
        num: '01 — Movement',
        title: 'Calibre OB-9',
        text: 'A 231-part manual movement, beating at 21,600 vibrations per hour. Every bridge is black-polished by hand — a mirror finish that reads pure black from one angle, pure light from another.',
      },
      {
        num: '02 — Case',
        title: 'Single-pour gold',
        text: 'We cast each 40mm case from one uninterrupted pour, a technique that leaves no seam and no weld. The result rings like a bell when struck — our oldest test, and still our best.',
      },
      {
        num: '03 — Dial',
        title: 'Volcanic glass',
        text: 'Dials are sliced from Icelandic obsidian, ground to 0.4mm, and fired with gold leaf. No two share the same fracture pattern; no two ever will.',
      },
      {
        num: '04 — Time',
        title: 'It is',
        clock: true,
        text: 'The watch beside this text keeps real time — your time — drawn stroke by stroke, the way we believe a dial should be read: quietly, and without a single pixel wasted.',
      },
    ],
  },
  dial: { brand: 'OBSIDIAN', place: 'GENÈVE' },
  collection: {
    kicker: 'The Collection',
    headingHtml: 'Three dials. <em>One obsession.</em>',
    enquireLabel: 'Enquire →',
    watches: [
      { dial: 'obsidian', name: 'Noir Origine', ref: 'Ref. OB-101 · Obsidian dial', price: 'CHF 84,000' },
      { dial: 'meteor', name: 'Météore', ref: 'Ref. OB-102 · Muonionalusta iron', price: 'CHF 97,000' },
      { dial: 'forest', name: 'Forêt Noire', ref: 'Ref. OB-103 · Nephrite jade', price: 'CHF 89,000' },
    ],
  },
  manifesto: {
    quoteHtml:
      '“A watch is the only machine you will ever own whose purpose is to make you <em>slower</em>. We build them accordingly.”',
    cite: '— The Obsidian Manifesto, 1911',
  },
  specs: {
    kicker: 'Specifications',
    headingHtml: 'The numbers, <em>for those who ask.</em>',
    rows: [
      { label: 'Calibre', valueHtml: 'OB-9, manual wind, <i>231 components</i>' },
      { label: 'Reserve', valueHtml: '96 hours — <i>a long weekend, untouched</i>' },
      { label: 'Case', valueHtml: '40mm, single-pour 18k gold, 9.1mm slim' },
      { label: 'Crystal', valueHtml: 'Domed sapphire, inner anti-reflective' },
      { label: 'Production', valueHtml: '<i>Thirty-eight pieces</i> per year, numbered' },
      { label: 'Waiting list', valueHtml: 'Four years — <i>we suggest patience</i>' },
    ],
  },
  footer: {
    addressHtml: 'Rue du Rhône 114, Geneva<br>By appointment only.',
    creditHtml: 'A fictional maison, designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
  showcase: {
    chipLabel: '← Fable Showcase',
    chipHref: '/',
    footerHtml: 'Part of the <a href="/">Fable Showcase</a> — 25 sites, 25 styles.',
  },
};
