/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<a>/<br> only). */
export interface Link {
  label: string;
  href: string;
}

/** Which mini sky illustration a forecast card draws. */
export type SkyObject = 'venus' | 'orion' | 'andromeda' | 'iss';

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Spaced display wordmark in nav + footer; the `<span>` letter is accented. */
  wordmarkHtml: string;
  /** Top-bar links; each href targets a section id. */
  nav: Link[];
  hero: {
    /** Accessible name of the particle canvas. */
    canvasLabel: string;
    kicker: string;
    /** `<b>` renders brighter. */
    bodyHtml: string;
    cta: Link;
    morph: {
      /** Small caption above the current shape name. */
      label: string;
      /** The word the particles spell on load and between shapes. Also the first shape name. */
      word: string;
      /** Names shown while the particles form the constellation, galaxy and dome, in that order. */
      shapeNames: [orion: string, galaxy: string, dome: string];
    };
  };
  shows: {
    id: string;
    kicker: string;
    /** `<em>` renders lavender. */
    headingHtml: string;
    items: {
      /** Start time, e.g. "18:00". */
      time: string;
      /** Running time under the start time, e.g. "45 MIN". */
      duration: string;
      title: string;
      description: string;
      /** Age pill (hidden on mobile). */
      age: string;
      book: Link;
    }[];
  };
  tonight: {
    id: string;
    kicker: string;
    /** `<em>` renders lavender. */
    headingHtml: string;
    objects: {
      kind: SkyObject;
      /** Magnitude badge, e.g. "MAG −4.2". */
      magnitude: string;
      name: string;
      /** Category and sky position, e.g. "Planet · West". */
      type: string;
      description: string;
    }[];
  };
  membership: {
    id: string;
    kicker: string;
    /** `<em>` renders lavender. */
    headingHtml: string;
    /** `<em>` renders gold. */
    offerHtml: string;
    description: string;
    cta: Link;
  };
  footer: {
    /** Address / hours; `<br>` allowed. */
    noteHtml: string;
    /** Credit line above the showcase link (`<a>` allowed). */
    creditHtml?: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'STELLAR — City Planetarium',
    description:
      'STELLAR is the city planetarium. Two thousand particles form words, constellations and galaxies above your head — on this page and under our dome.',
    ogTitle: 'STELLAR — City Planetarium',
    ogDescription: 'Particles morph into constellations. Shows nightly.',
  },
  wordmarkHtml: 'STELL<span>A</span>R',
  nav: [
    { label: 'Shows', href: '#shows' },
    { label: 'Tonight', href: '#tonight' },
    { label: 'Membership', href: '#membership' },
  ],
  hero: {
    canvasLabel: 'Two thousand particles morphing between the word STELLAR, constellations and a galaxy',
    kicker: 'City Planetarium · Est. 1962',
    bodyHtml:
      'Every dot above is one of <b>two thousand particles</b> — currently busy being a word, about to become <b>a constellation</b>, then a galaxy, then a word again. Our dome does this nightly, at planet scale.',
    cta: { label: "Tonight's shows", href: '#shows' },
    morph: {
      label: 'Now forming',
      word: 'STELLAR',
      shapeNames: ['ORION', 'GALAXY', 'THE DOME'],
    },
  },
  shows: {
    id: 'shows',
    kicker: 'Under the Dome',
    headingHtml: "Tonight's <em>projections.</em>",
    items: [
      {
        time: '18:00',
        duration: '45 MIN',
        title: 'First Light',
        description:
          "A gentle tour of tonight's sky for first-timers and their grown-ups. Includes the moon behaving dramatically.",
        age: 'All ages',
        book: { label: 'Book →', href: '#' },
      },
      {
        time: '19:30',
        duration: '60 MIN',
        title: 'Dead Stars & Debt',
        description:
          'Every atom of iron in your blood left a dying star unpaid. A show about supernovae and inheritance.',
        age: '12+',
        book: { label: 'Book →', href: '#' },
      },
      {
        time: '21:00',
        duration: '75 MIN',
        title: 'The Slow Sky',
        description:
          'One hour, one reclined chair, the sky sped up ten-thousand-fold. Precession, drift, and the patience of constellations.',
        age: '16+',
        book: { label: 'Book →', href: '#' },
      },
      {
        time: '23:00',
        duration: '50 MIN',
        title: 'Static — A Radio Sky',
        description:
          'The universe as sound: pulsars, the cosmic microwave background, and forty minutes of very good noise.',
        age: '18+ · Loud',
        book: { label: 'Book →', href: '#' },
      },
    ],
  },
  tonight: {
    id: 'tonight',
    kicker: 'Naked-Eye Forecast',
    headingHtml: 'Step outside, <em>look up.</em>',
    objects: [
      {
        kind: 'venus',
        magnitude: 'MAG −4.2',
        name: 'Venus',
        type: 'Planet · West',
        description: 'Unmissable after sunset. Frequently reported to us as a UFO. It is not. It never is.',
      },
      {
        kind: 'orion',
        magnitude: 'MAG +0.4',
        name: 'Orion',
        type: 'Constellation · South-East',
        description: "The belt rises by ten. Betelgeuse still hasn't exploded. We're as disappointed as you are.",
      },
      {
        kind: 'andromeda',
        magnitude: 'MAG +3.4',
        name: 'Andromeda',
        type: 'Galaxy · Overhead',
        description: 'The farthest thing your eye can see: 2.5 million light-years, no ticket required.',
      },
      {
        kind: 'iss',
        magnitude: 'VAR',
        name: 'ISS Pass',
        type: 'Spacecraft · 21:14, NW→SE',
        description: "Six humans, one bright dot, four minutes. Wave. They can't see you. Wave anyway.",
      },
    ],
  },
  membership: {
    id: 'membership',
    kicker: 'Membership',
    headingHtml: 'Adopt <em>a star.</em>',
    offerHtml: '€60 a year. Unlimited sky. <em>One star, named after anyone you like.</em>',
    description:
      'Members enter free, bring a guest on Thursdays, and receive a certificate for one star from our registry. Legally meaningless. Emotionally binding.',
    cta: { label: 'Become a member', href: '#' },
  },
  footer: {
    noteHtml: "1 Observatory Hill · Doors 17:30<br>Closed on cloudless full moons — we're outside.",
    creditHtml: 'A fictional planetarium, designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
};
