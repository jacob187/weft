/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<br>/<a>/<i> only). */
export interface Link {
  label: string;
  href: string;
}

/** Cover drawing for a zine (generated SVG in zart.ts). */
export type ZineArt = 'flower' | 'bus' | 'puddle' | 'fridge';

/** Paper stock for a zine cover; maps to a `--<name>` token (`cream` → `--cream`). */
export type ZinePaper = 'cream' | 'peach' | 'sky' | 'blush';

export interface HeroLine {
  text: string;
  /** Riso ink for the line; omit for plain ink. */
  tone?: 'red' | 'blue';
  /** Print a misregistered blue ghost copy behind the line. */
  ghost?: boolean;
}

/** A scrap of paper pinned around the hero collage; offsets are CSS lengths. */
export interface Floater {
  text: string;
  /** Tilt in degrees. */
  rotate: number;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface Zine {
  /** Small typewriter line on the cover, e.g. "ISSUE Nº2 · 2ND PRINT". */
  numberLabel: string;
  titleHtml: string;
  paper: ZinePaper;
  art: ZineArt;
  /** Handwritten tagline under the cover. */
  kind: string;
  /** Price tag under the cover (or "SOLD OUT"). */
  price: string;
  /** Resting tilt in degrees. */
  tilt: number;
}

export interface SectionTitle {
  headingHtml: string;
  /** Handwritten aside next to the heading. */
  hand: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Logo label in nav + footer; wrap the accented part in <i>. */
  logoHtml: string;
  nav: Link[];
  hero: {
    /** Stacked lines of the big collage headline. */
    lines: HeroLine[];
    handHtml: string;
    floaters: Floater[];
    /** Round sticker at the corner of the collage. */
    stickerHtml: string;
  };
  issues: SectionTitle & { id: string; zines: Zine[] };
  about: SectionTitle & {
    id: string;
    /** Paragraphs of the typed letter. */
    paragraphsHtml: string[];
    signatureHtml: string;
  };
  stockists: SectionTitle & {
    id: string;
    shops: { name: string; place: string }[];
  };
  submit: {
    id: string;
    headingHtml: string;
    body: string;
    cta: Link;
  };
  footer: {
    noteHtml: string;
    creditHtml: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'PAPERCUT — A Zine Studio',
    description:
      'PAPERCUT is a two-person zine studio. Riso ink, torn edges, staples slightly crooked on purpose. Every scrap on this page is generated code.',
    ogTitle: 'PAPERCUT — A Zine Studio',
    ogDescription: 'Riso ink, torn edges, staples slightly crooked on purpose.',
  },
  logoHtml: 'PAPER<i>CUT</i>',
  nav: [
    { label: 'the zines', href: '#issues' },
    { label: 'who??', href: '#about' },
    { label: 'where to find us', href: '#stockists' },
    { label: 'submit!!', href: '#submit' },
  ],
  hero: {
    lines: [{ text: 'CUT.' }, { text: 'PASTE.', tone: 'red', ghost: true }, { text: 'STAPLE.', tone: 'blue' }],
    handHtml: 'a two-person zine studio — everything printed <b>slightly wrong on purpose</b> ♡',
    floaters: [
      { text: 'riso ink forever!', rotate: -7, top: '-8%', left: '-4%' },
      { text: 'est. in a kitchen, 2021', rotate: 5, top: '4%', right: '-6%' },
      { text: '40 pages, 2 colors, 0 ads', rotate: 3, bottom: '-15%', left: '-5%' },
    ],
    stickerHtml: 'HAND<br>MADE',
  },
  issues: {
    id: 'issues',
    headingHtml: 'The <em>Issues</em>',
    hand: '← all four of them. we\'re slow. it\'s part of the charm.',
    zines: [
      {
        numberLabel: 'ISSUE Nº1 · SOLD OUT (SORRY)',
        titleHtml: 'Gas Station<br>Flowers',
        paper: 'cream',
        art: 'flower',
        kind: 'photo essays',
        price: 'SOLD OUT',
        tilt: -1.8,
      },
      {
        numberLabel: 'ISSUE Nº2 · 2ND PRINT',
        titleHtml: 'Overheard<br>on the 4AM Bus',
        paper: 'peach',
        art: 'bus',
        kind: 'found dialogue',
        price: '$9',
        tilt: 1.4,
      },
      {
        numberLabel: 'ISSUE Nº3 · FRESH',
        titleHtml: 'A Field Guide<br>to Puddles',
        paper: 'sky',
        art: 'puddle',
        kind: 'very wet research',
        price: '$9',
        tilt: -0.9,
      },
      {
        numberLabel: 'ISSUE Nº4 · PRE-ORDER',
        titleHtml: 'Everyone\'s<br>Fridge Poems',
        paper: 'blush',
        art: 'fridge',
        kind: 'magnet literature',
        price: '$11',
        tilt: 2,
      },
    ],
  },
  about: {
    id: 'about',
    headingHtml: 'Who <em>are</em> we',
    hand: 'a letter, typed on the actual machine ↓',
    paragraphsHtml: [
      'hi. we are june (scissors) and marco (glue). papercut started because our group chat kept saying <b>"someone should make a zine about this"</b> and nobody ever did.',
      'we print riso in two colors because the machine only has two drums, and honestly? <b>constraints are the whole aesthetic.</b> the misregistration is not a mistake. okay, sometimes it\'s a mistake. we keep the good mistakes.',
      'each issue is 40 pages, stapled by hand while watching movies. if your copy has a crooked staple, it was a good movie.',
    ],
    signatureHtml: '— june &amp; marco',
  },
  stockists: {
    id: 'stockists',
    headingHtml: 'Stockists',
    hand: 'aka shops that tolerate us',
    shops: [
      { name: 'Left Bank Books', place: 'portland' },
      { name: 'Riso Riso', place: 'tokyo' },
      { name: 'The Paper Cave', place: 'berlin' },
      { name: 'Good Grief Press', place: 'melbourne' },
      { name: 'Corner Copy', place: 'nyc' },
      { name: 'your backpack', place: 'at fairs' },
    ],
  },
  submit: {
    id: 'submit',
    headingHtml: 'Submit to <em>Issue Nº5</em>',
    body: 'theme: "THINGS WE ALMOST THREW AWAY." essays, photos, lists, receipts with feelings on them. 300 words max because the pages are small and so is our patience for editing.',
    cta: { label: 'Send us your scraps', href: '#' },
  },
  footer: {
    noteHtml: 'A fictional studio. The aesthetic is achievable.<br>Every torn edge on this page is generated code.',
    creditHtml: 'Original design by <a href="https://github.com/BrainwavePro">BrainwavePro</a>',
  },
};
