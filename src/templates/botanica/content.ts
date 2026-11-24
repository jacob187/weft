/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<br>/<a>/<span> only). */
export interface Link {
  label: string;
  href: string;
}

/** Botanical icon drawn above a note. */
export type GlyphId = 'citrus' | 'rose' | 'root';

/** Bottle colorway; maps to the `--bottle-<id>-*` tokens in theme.css. */
export type BottleId = 'verte' | 'mai' | 'pluie';

export interface Note {
  /** Pill in the card's top-right corner, e.g. "Top · 0–15 min". */
  stage: string;
  glyph: GlyphId;
  name: string;
  /** Italic Latin name. */
  latin: string;
  text: string;
}

export interface Bottle {
  variant: BottleId;
  name: string;
  /** Printed on the bottle label (upper case). */
  label: string;
  /** Italic note list under the name. */
  notes: string;
  price: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Brand wordmark in the nav and footer; the <span> is tinted terracotta. */
  wordmarkHtml: string;
  /** Section anchors available: #notes, #collection, #story, #almanac. Nav is hidden below 900px. */
  nav: Link[];
  hero: {
    /** Small caps line above the headline. */
    est: string;
    headingHtml: string;
    sub: string;
    cta: Link;
    /** Cue shown at the bottom of the hero (hidden below 760px). */
    scrollLabel: string;
  };
  notes: { kicker: string; headingHtml: string; items: Note[] };
  /** Brand printed on every bottle label. */
  labelBrand: string;
  collection: { kicker: string; headingHtml: string; bottles: Bottle[] };
  story: { kicker: string; quoteHtml: string; cite: string };
  almanac: {
    kicker: string;
    headingHtml: string;
    rows: { month: string; title: string; text: string }[];
  };
  footer: { addressHtml: string; creditHtml: string };
  /** Showcase-only chrome; rendered only when the Template receives `showcase`. */
  showcase?: { chipLabel: string; chipHref: string; footerHtml: string };
}

export const demo: Content = {
  seo: {
    title: 'BOTANICA — Perfumes Grown, Not Made',
    description:
      'BOTANICA is a botanical perfumery. Scent drawn from living gardens — vines grow down this very page as you scroll.',
    ogTitle: 'BOTANICA — Perfumes Grown, Not Made',
    ogDescription: 'A generative garden that grows as you scroll.',
  },
  wordmarkHtml: 'BOTANIC<span>A</span>',
  nav: [
    { label: 'Notes', href: '#notes' },
    { label: 'Collection', href: '#collection' },
    { label: 'Garden', href: '#story' },
    { label: 'Almanac', href: '#almanac' },
  ],
  hero: {
    est: 'Perfumery · Grasse & Kyoto · Est. 1987',
    headingHtml: 'Grown,<br>not <em>made.</em>',
    sub: 'Every Botanica scent begins as a living plant in one of our two gardens. We do not extract. We wait. And this page, like our perfume, grows as you move through it — scroll, and watch the garden climb.',
    cta: { label: 'Enter the garden', href: '#notes' },
    scrollLabel: 'Scroll to grow',
  },
  notes: {
    kicker: 'The Anatomy of a Scent',
    headingHtml: 'Three notes,<br>read <em>from the stem up.</em>',
    items: [
      {
        stage: 'Top · 0–15 min',
        glyph: 'citrus',
        name: 'Green Yuzu',
        latin: 'Citrus junos',
        text: 'Picked before dawn in our Kyoto walled garden, while the peel is still cold. The first thing you smell, and the first thing to leave — like all bright things.',
      },
      {
        stage: 'Heart · 4 hrs',
        glyph: 'rose',
        name: 'May Rose',
        latin: 'Rosa centifolia',
        text: 'One hundred petals to a bloom, one bloom to a bottle. Harvested for three weeks each May in Grasse, and coaxed — never pressed — into absolute.',
      },
      {
        stage: 'Base · 3 days',
        glyph: 'root',
        name: 'Vetiver Root',
        latin: 'Chrysopogon zizanioides',
        text: 'Two years underground before we lift it. The scent of patience itself: dry earth, cut cedar, and the afternoon it finally rained.',
      },
    ],
  },
  labelBrand: 'BOTANICA',
  collection: {
    kicker: 'The Collection',
    headingHtml: 'Three gardens, <em>bottled.</em>',
    bottles: [
      {
        variant: 'verte',
        name: 'Ombre Verte',
        label: 'OMBRE VERTE',
        notes: 'yuzu · fig leaf · vetiver',
        price: 'EAU DE PARFUM · 50ML · €180',
      },
      {
        variant: 'mai',
        name: 'Le Premier Mai',
        label: 'LE PREMIER MAI',
        notes: 'may rose · peony · white musk',
        price: 'EAU DE PARFUM · 50ML · €210',
      },
      {
        variant: 'pluie',
        name: 'Après la Pluie',
        label: 'APRÈS LA PLUIE',
        notes: 'petrichor · moss · cedar',
        price: 'EAU DE PARFUM · 50ML · €195',
      },
    ],
  },
  story: {
    kicker: 'From the Garden Journal',
    quoteHtml:
      '“Industry asks how fast a flower can be turned into money. We ask only <b>what the garden is willing to give</b> — and some years, the answer is nothing. Those are the years we learn the most.”',
    cite: '— Élise Fontaine, Head Gardener',
  },
  almanac: {
    kicker: 'The Almanac',
    headingHtml: 'A year in the garden,<br><em>abridged.</em>',
    rows: [
      {
        month: 'January',
        title: 'The waiting',
        text: "Nothing blooms. We prune, sharpen, and read last year's notes. The stills are cold.",
      },
      {
        month: 'May',
        title: 'Rose harvest',
        text: 'Twenty-one days, starting at 5 a.m. Every picker carries a linen sack — plastic bruises the petals.',
      },
      {
        month: 'August',
        title: 'Yuzu, green',
        text: 'Picked unripe, by hand, with gloves. The peel oil is so volatile we distill within four hours.',
      },
      {
        month: 'October',
        title: 'Vetiver lifting',
        text: 'Roots planted two autumns ago finally come up. The whole garden smells like a dry riverbed.',
      },
      {
        month: 'December',
        title: 'First blend',
        text: "The year's absolutes meet for the first time. Most blends fail. The ones that don't become Botanica.",
      },
    ],
  },
  footer: {
    addressHtml: '17 Rue des Jardiniers, Grasse<br>A garden first, a company second.',
    creditHtml: 'A fictional perfumery, original design by <a href="https://github.com/BrainwavePro">BrainwavePro</a>',
  },
  showcase: {
    chipLabel: '← Weft',
    chipHref: '/',
    footerHtml: 'Part of <a href="/">Weft</a> — 25 sites, 25 styles.',
  },
};
