/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<a>/<br> only). */
export interface Link {
  label: string;
  href: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  brand: {
    /** Single kanji used as the logo mark, the large enso glyph and the menu hover stamp. */
    kanji: string;
    /** Romanised label next to the kanji in the nav. */
    navName: string;
    /** Romanised label next to the kanji in the footer. */
    footerName: string;
  };
  /** Top-bar links; each href targets a section id. */
  nav: Link[];
  hero: {
    /** `<em>` renders vermilion. */
    headingHtml: string;
    sub: string;
    cta: Link;
    /** Vertical columns shown right of the enso (desktop only). */
    vertical: {
      /** Small vermilion first column. */
      accent: string;
      /** Remaining columns; `<b>` renders darker. */
      columnsHtml: string[];
    };
    /** Bottom-right caption of the hero. */
    foot: string;
  };
  ceremony: {
    id: string;
    kicker: string;
    /** `<em>` gets the animated brush underline. */
    headingHtml: string;
    steps: {
      /** Duration badge, e.g. "§ 12 MIN". */
      duration: string;
      /** Outlined numeral glyph. */
      numeral: string;
      title: string;
      /** Japanese name with romaji, shown in vermilion. */
      jp: string;
      body: string;
    }[];
  };
  menu: {
    id: string;
    kicker: string;
    heading: string;
    teas: {
      /** Japanese tea name in gold. */
      jp: string;
      name: string;
      description: string;
      price: string;
    }[];
    note: string;
  };
  garden: {
    id: string;
    kicker: string;
    /** `<em>` gets the animated brush underline. */
    headingHtml: string;
    /** Body paragraphs beside the raked-sand canvas; `<b>` renders darker. */
    paragraphsHtml: string[];
    haiku: {
      /** One verse line each. */
      lines: string[];
      /** Translation shown under the verse. */
      note: string;
    };
  };
  visit: {
    id: string;
    kicker: string;
    /** `<em>` gets the animated brush underline. */
    headingHtml: string;
    items: {
      label: string;
      /** Value line(s); `<br>` allowed. */
      valueHtml: string;
      note: string;
    }[];
  };
  footer: {
    note: string;
    /** Credit line above the showcase link (`<a>`/`<br>` allowed). */
    creditHtml?: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'KAZE 風 — A Tea House in Kyoto',
    description:
      'KAZE is a tea house in northern Kyoto. Four seats, one hearth, tea served the slow way for three hundred years.',
    ogTitle: 'KAZE 風 — A Tea House in Kyoto',
    ogDescription: 'Four seats, one hearth, three hundred years.',
  },
  brand: { kanji: '風', navName: 'Kaze · Tea House', footerName: 'Kaze · Est. 1724' },
  nav: [
    { label: 'Ceremony', href: '#ceremony' },
    { label: 'Tea', href: '#menu' },
    { label: 'Garden', href: '#garden' },
    { label: 'Visit', href: '#visit' },
  ],
  hero: {
    headingHtml: 'The wind arrives<br>with <em>no appointment.</em><br>Neither must you.',
    sub: 'Kaze is a four-seat tea house at the north edge of Kyoto. We have poured tea the same way for three hundred years: slowly, in silence, and always facing the garden.',
    cta: { label: 'Request a seat', href: '#visit' },
    vertical: {
      accent: '京都・北山',
      columnsHtml: ['茶は<b>沈黙</b>の言葉である', '三百年、同じ湯、同じ静けさ'],
    },
    foot: 'Est. 1724 · Kyoto — Four seats · By letter only',
  },
  ceremony: {
    id: 'ceremony',
    kicker: 'The Ceremony',
    headingHtml: '<em>One hour,</em> divided into four silences.',
    steps: [
      {
        duration: '§ 12 MIN',
        numeral: '一',
        title: 'Arrival',
        jp: '迎付 — mukaezuke',
        body: 'You remove your shoes, your watch, and — into a small lacquer box — your phone. The box is returned at the end. Most guests hesitate. All guests thank us.',
      },
      {
        duration: '§ 18 MIN',
        numeral: '二',
        title: 'The Charcoal',
        jp: '炭点前 — sumidemae',
        body: 'The host builds the fire in front of you. Watching charcoal being arranged sounds dull. It is, gloriously. That is the point.',
      },
      {
        duration: '§ 20 MIN',
        numeral: '三',
        title: 'The Tea',
        jp: '濃茶 — koicha',
        body: 'Thick matcha, whisked to lacquer, shared from a single bowl thrown in this village before your grandmother was born.',
      },
      {
        duration: '§ 10 MIN',
        numeral: '四',
        title: 'The Garden',
        jp: '見送り — miokuri',
        body: 'Nothing is served. You sit, the garden continues, and for ten minutes nobody needs anything from you at all.',
      },
    ],
  },
  menu: {
    id: 'menu',
    kicker: 'This Season',
    heading: 'Autumn pours',
    teas: [
      {
        jp: '濃茶',
        name: 'Koicha — First Frost',
        description:
          'Stone-milled from single-cultivar Uji leaf shaded forty days. Thick as paint, green as the moment before rain.',
        price: '¥3,800',
      },
      {
        jp: '薄茶',
        name: 'Usucha — Morning Fog',
        description:
          "The lighter whisk. Served with one wagashi shaped after this week's garden — currently: a maple leaf letting go.",
        price: '¥2,200',
      },
      {
        jp: '玄米',
        name: 'Genmaicha — Field Smoke',
        description:
          "Roasted rice and last spring's bancha. The tea our farmers drink at four a.m. We see no reason to improve it.",
        price: '¥1,400',
      },
      {
        jp: '白湯',
        name: 'Sayu — Plain Hot Water',
        description:
          'From the same iron kettle, in the same bowls. Order it once and you will understand everything else on this list.',
        price: '¥0',
      },
    ],
    note: 'The menu changes with the garden — not the calendar',
  },
  garden: {
    id: 'garden',
    kicker: 'The Garden',
    headingHtml: 'Fifteen stones. <em>You will count fourteen.</em>',
    paragraphsHtml: [
      "Our karesansui garden is raked every morning at five by whichever apprentice annoyed the master least the day before. The gravel is <b>Shirakawa granite</b>; the pattern changes with the wind's mood, which is to say, with ours.",
      'Like the famous garden at Ryōan-ji, one stone always hides behind another. Guests who claim to see all fifteen are offered a second bowl and a chair with a better view of their own certainty.',
    ],
    haiku: {
      lines: ['枯山水', '風の描いた', '線を汲む'],
      note: 'THE DRY GARDEN — DRAWING WATER FROM LINES THE WIND DREW',
    },
  },
  visit: {
    id: 'visit',
    kicker: 'Visit',
    headingHtml: 'By letter, <em>the old way.</em>',
    items: [
      {
        label: 'Address',
        valueHtml: '37 Kitayama Lane<br>Kyoto 603-8475',
        note: "Twelve minutes' walk north of the bus stop. Follow the moss.",
      },
      {
        label: 'Seats',
        valueHtml: 'Four per day<br>Two sittings',
        note: '10:00 and 15:00. We do not seat parties of four; strangers share better.',
      },
      {
        label: 'Reservations',
        valueHtml: 'Postcards only',
        note: 'Write your name, your month, and one sentence about why. We reply within the season.',
      },
      {
        label: 'Phones',
        valueHtml: 'The lacquer box',
        note: 'Non-negotiable since 2009. The box is very beautiful. Your phone will be fine.',
      },
    ],
  },
  footer: {
    note: 'A fictional tea house in a real tradition.',
    creditHtml: 'Original design by <a href="https://github.com/BrainwavePro">BrainwavePro</a>',
  },
};
