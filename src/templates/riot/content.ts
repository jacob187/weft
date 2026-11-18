/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<br>/<span>/<a> only). */
export interface Link {
  label: string;
  href: string;
}

/** Lineup size: 1 is a solid headliner, 2 an outlined second line, 3 small dim type. */
export type ActTier = 1 | 2 | 3;

export interface Act {
  name: string;
  /** Day · stage · time, revealed on hover (desktop only). */
  slot: string;
  tier: ActTier;
  href: string;
}

export interface Stage {
  name: string;
  /** Capacity line, e.g. "CAP 30,000". */
  cap: string;
  description: string;
}

export interface Tier {
  name: string;
  price: string;
  /** Unit after the price, e.g. "/day". */
  unit: string;
  perks: string[];
  /** Diagonal ribbon across the corner, e.g. "SOLD OUT". */
  ribbon?: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Logo in the nav and footer; wrap the accented half in `<em>`. */
  brandHtml: string;
  /** Nav links before the ticket sticker. */
  nav: Link[];
  /** Tilted acid-green nav sticker. */
  navCta: Link;
  hero: {
    /** Date/venue/tagline pieces, joined by `dateSeparator`. */
    dates: string[];
    dateSeparator: string;
    /** The two big words. Each letter is split out and reacts to hover. */
    title: [string, string];
    /** Accessible name for the split title. */
    titleLabel: string;
    subHtml: string;
    /** Hint under the sub line (desktop only). */
    hint: string;
    cta: Link;
  };
  /** Two opposing marquee strips (first scrolls left, second right); each repeats its items endlessly. */
  marquees: { items: string[] }[];
  /** Glyph after every marquee item. */
  marqueeSeparator: string;
  lineup: {
    /** Anchor id of the section (nav links target it). */
    id: string;
    kicker: string;
    headingHtml: string;
    acts: Act[];
    /** Italic line after the last act. */
    more: string;
  };
  stages: {
    id: string;
    kicker: string;
    headingHtml: string;
    items: Stage[];
  };
  tickets: {
    id: string;
    kicker: string;
    headingHtml: string;
    tiers: Tier[];
  };
  footer: {
    noteHtml: string;
    /** Credit line; the showcase line is appended on showcase routes. */
    creditHtml: string;
  };
}

export const demo: Content = {
  seo: {
    title: "RIOT FEST '27 — Three Days, Zero Chill",
    description:
      "RIOT FEST '27. Three days, four stages, one noise complaint that became a tradition. Kinetic typography turned all the way up.",
    ogTitle: "RIOT FEST '27 — Three Days, Zero Chill",
    ogDescription: 'Three days, four stages, zero chill.',
  },
  brandHtml: 'RIOT<em>FEST</em>',
  nav: [
    { label: 'Lineup', href: '#lineup' },
    { label: 'Stages', href: '#stages' },
  ],
  navCta: { label: 'Tickets', href: '#tickets' },
  hero: {
    dates: ['JUL 16—18', 'DUSTBOWL FIELDS', 'ALL AGES, ALL VOLUME'],
    dateSeparator: '●',
    title: ['RIOT', "FEST'27"],
    titleLabel: 'RIOT FEST',
    subHtml: 'Three days. Four stages. <b>One noise complaint</b> that became a tradition.',
    hint: 'Hover the letters — they bite back.',
    cta: { label: 'GET TICKETS →', href: '#tickets' },
  },
  marquees: [
    { items: ["LAST YEAR'S MUD: LEGENDARY", 'EARPLUGS: FREE', 'REGRETS: SOLD SEPARATELY'] },
    {
      items: ['72 HOURS OF NOISE', '41 ACTS', '1 FERRIS WHEEL (LOUD)', 'HYDRATE OR DIE-DRATE'],
    },
  ],
  marqueeSeparator: '✶',
  lineup: {
    id: 'lineup',
    kicker: 'The Lineup',
    headingHtml: '41 acts.<br><em>Zero fillers.</em>',
    acts: [
      { name: 'Velvet Sirens', slot: 'FRI · MAIN · 22:00', tier: 1, href: '#' },
      { name: 'Static Prophets', slot: 'SAT · MAIN · 22:00', tier: 1, href: '#' },
      { name: 'Glass Anthem', slot: 'SUN · MAIN · 21:30', tier: 1, href: '#' },
      { name: 'Neon Wolves', slot: 'FRI · PIT · 20:00', tier: 2, href: '#' },
      { name: 'The Howl Committee', slot: 'SAT · PIT · 19:30', tier: 2, href: '#' },
      { name: 'Feedback Choir', slot: 'SUN · PIT · 20:30', tier: 2, href: '#' },
      { name: 'Dial Tone Romance', slot: 'FRI · TENT · 18:00', tier: 3, href: '#' },
      { name: 'Mosh Botanist', slot: 'SAT · TENT · 17:00', tier: 3, href: '#' },
      { name: "Grandma's Amplifier", slot: 'SUN · TENT · 16:00', tier: 3, href: '#' },
      { name: 'Polite Chaos', slot: 'SUN · TENT · 15:00', tier: 3, href: '#' },
    ],
    more: "+ 31 more acts we'll announce the moment their vans are confirmed running.",
  },
  stages: {
    id: 'stages',
    kicker: 'The Stages',
    headingHtml: 'Four flavors <em>of loud.</em>',
    items: [
      {
        name: 'Main',
        cap: 'CAP 30,000',
        description: 'The big one. Headliners, pyro, and a sound system visible from orbit.',
      },
      {
        name: 'The Pit',
        cap: 'CAP 8,000',
        description: 'Sunken bowl, zero seats, structural bass. Leave the white shoes home.',
      },
      {
        name: 'Tent',
        cap: 'CAP 2,500',
        description: "Tomorrow's headliners at eye level. Sweatier and prouder of it.",
      },
      {
        name: 'The Ditch',
        cap: 'CAP ???',
        description: 'Unbooked. Unofficial. Whoever drags an amp down there owns the hour.',
      },
    ],
  },
  tickets: {
    id: 'tickets',
    kicker: 'Tickets',
    headingHtml: 'Pick your <em>damage.</em>',
    tiers: [
      {
        name: 'Day Pass',
        price: '$89',
        unit: '/day',
        perks: ['One day, all stages', 'Free earplugs', 'Water refills forever'],
      },
      {
        name: 'Full Riot',
        price: '$199',
        unit: '/3 days',
        perks: ['All three days', 'Campsite access', 'Ferris wheel priority', 'Monday off (not us, but still)'],
      },
      {
        name: 'Dust Royalty',
        price: '$450',
        unit: '/3 days',
        perks: ['Side-stage viewing', 'Showers with pressure', "Laminate you'll frame"],
        ribbon: 'SOLD OUT',
      },
    ],
  },
  footer: {
    noteHtml: 'Dustbowl Fields · July 16–18, 2027<br>A fictional festival. The tinnitus is illustrative.',
    creditHtml: 'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
};
