/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<br>/<span>/<a> only). */
export interface Link {
  label: string;
  href: string;
}

/** Thick-outline pastry illustration drawn above a menu card. */
export type PastryArt = 'croissant' | 'donut' | 'roll' | 'loaf';

/** Palette token behind a menu card's tag pill. */
export type TagTone = 'butter' | 'berry' | 'sky' | 'mint';

export interface MenuItem {
  /** Sticker price in the card's top-right corner. */
  price: string;
  art: PastryArt;
  name: string;
  description: string;
  /** Pill under the description. */
  tag: string;
  tagTone: TagTone;
}

/** One entry of the daily oven schedule. */
export interface OvenSlot {
  /** 24-hour start time as "H:MM", e.g. "7:00". The slot lasts until the next slot starts (the last until midnight). */
  time: string;
  what: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  brand: {
    /** Emoji (or short text) in the logo's boxed badge. */
    mark: string;
    name: string;
  };
  /** Nav links before the order button. */
  nav: Link[];
  /** Pill-shaped order button at the end of the nav. */
  orderCta: Link;
  hero: {
    /** Pulsing status pill above the heading. */
    badge: string;
    /** Wrap the bobbing words in `<span class="berry">` / `<span class="butter">`. */
    headingHtml: string;
    sub: string;
    cta: Link;
    /** Small italic line under the button. */
    note: string;
  };
  /** Scrolling ticker; the items repeat endlessly, each followed by the separator. */
  marquee: { items: string[]; separator: string };
  menu: {
    /** Anchor id of the section (nav links target it). */
    id: string;
    kicker: string;
    heading: string;
    items: MenuItem[];
  };
  hourly: {
    id: string;
    kicker: string;
    heading: string;
    /** Sticker on the slot that is baking right now (local time). */
    nowLabel: string;
    schedule: OvenSlot[];
  };
  promise: {
    id: string;
    quoteHtml: string;
    cite: string;
  };
  footer: {
    noteHtml: string;
    /** Credit line; the showcase line is appended on showcase routes. */
    creditHtml: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'DOUGHBOX — Very Serious Pastry',
    description:
      'DOUGHBOX is a bakery that takes butter seriously and itself not at all. Croissants hourly, sprinkles mandatory.',
    ogTitle: 'DOUGHBOX — Very Serious Pastry',
    ogDescription: 'Butter: serious. Us: not at all.',
  },
  brand: { mark: '🍩', name: 'DOUGHBOX' },
  nav: [
    { label: 'Menu', href: '#menu' },
    { label: 'Oven Times', href: '#hourly' },
    { label: 'The Promise', href: '#promise' },
  ],
  orderCta: { label: 'Order pickup', href: '#menu' },
  hero: {
    badge: 'OVEN STATUS: EXTREMELY ON',
    headingHtml: 'Very <span class="berry">serious</span><br>about <span class="butter">butter.</span>',
    sub: 'Everything else — the sprinkle ratios, the donut physics, the name of the sourdough starter (Clint) — we keep pretty loose.',
    cta: { label: "See today's bakes ↓", href: '#menu' },
    note: 'the blobs behind this text are made of code, not frosting. sadly.',
  },
  marquee: {
    items: [
      'CROISSANTS AT 7',
      'DONUTS AT 9',
      'CLINT RISES AT NOON',
      'SOLD OUT MEANS SOLD OUT',
      'GLUTEN: YES',
    ],
    separator: '✦',
  },
  menu: {
    id: 'menu',
    kicker: "Today's bakes",
    heading: 'Fresh out. Going fast.',
    items: [
      {
        price: '$4.50',
        art: 'croissant',
        name: 'The 27-Layer',
        description: 'A croissant laminated until the butter files a complaint. Shatters on contact.',
        tag: 'CULT FAVORITE',
        tagTone: 'butter',
      },
      {
        price: '$3.80',
        art: 'donut',
        name: 'Berry Ring',
        description: "Raspberry glaze, sprinkle census: 41–46. We count. We care. We're fine.",
        tag: 'SPRINKLED',
        tagTone: 'berry',
      },
      {
        price: '$5.20',
        art: 'roll',
        name: 'Cinnamon Event',
        description: 'Less a pastry, more a weather system. Comes with a fork and a warning.',
        tag: "WARM 'TIL 10",
        tagTone: 'sky',
      },
      {
        price: '$6.00',
        art: 'loaf',
        name: 'Clint Jr.',
        description: 'Sourdough by Clint (est. 2019, very much alive). Crackly, tangy, humbling.',
        tag: "CLINT'S KID",
        tagTone: 'mint',
      },
    ],
  },
  hourly: {
    id: 'hourly',
    kicker: 'Oven times',
    heading: 'Warm things, on the hour.',
    nowLabel: 'NOW',
    schedule: [
      { time: '7:00', what: 'Croissants' },
      { time: '8:00', what: 'Berry Rings' },
      { time: '9:00', what: 'Donut Drop' },
      { time: '10:00', what: 'Cinnamon Events' },
      { time: '11:00', what: 'Baguettes' },
      { time: '12:00', what: 'Clint Jr.' },
      { time: '14:00', what: 'Second Croissants' },
      { time: '16:00', what: 'Whatever Maya Wants' },
    ],
  },
  promise: {
    id: 'promise',
    quoteHtml:
      "“If it's not <em>ridiculous by breakfast</em>, we start over. This has only gone wrong twice, and both times we ate the evidence.”",
    cite: '— The Doughbox Promise, handwritten on the oven',
  },
  footer: {
    noteHtml: '14 Flour Lane · Wed–Sun, 7:00 until sold out<br>A fictional bakery. The crumbs are real.',
    creditHtml: 'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
};
