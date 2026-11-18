/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<br>/<a> only). */
export interface Link {
  label: string;
  href: string;
}

/** Which animated SVG creature a zone shows. */
export type Creature = 'jelly' | 'angler' | 'siphon';

export interface Zone {
  /** Section anchor id (nav links target `#${id}`). */
  id: string;
  /** Small glowing label above the heading, e.g. "— 200M · TWILIGHT ZONE". */
  depthLabel: string;
  headingHtml: string;
  bodyHtml: string;
  /** Italic "field note" callout with a glowing left rule. */
  fact: string;
  creature: Creature;
  /** Put the creature on the left and the copy on the right (desktop). */
  flip?: boolean;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Wordmark in nav + footer; wrap the accented letter in <b>. */
  wordmarkHtml: string;
  nav: Link[];
  /** Depth meter fixed to the right edge; reading = scroll progress × `max`. */
  depth: {
    /** Depth at the bottom of the page. */
    max: number;
    /** Unit shown after the number, e.g. "M". */
    unit: string;
  };
  hero: {
    /** Pill above the heading. */
    zoneTag: string;
    headingHtml: string;
    subHtml: string;
    /** "Begin descent" link below the hero copy. */
    descend: Link;
  };
  /** One section per depth zone, in descending order. */
  zones: Zone[];
  /** Closing call-to-action section at the bottom of the page. */
  trench: {
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
    title: 'ABYSSAL — Deep Ocean Research Institute',
    description:
      'ABYSSAL studies the 95% of the ocean nobody has lit yet. Scroll to descend — this page goes down 4,000 metres.',
    ogTitle: 'ABYSSAL — Deep Ocean Research Institute',
    ogDescription: 'Scroll to descend. This page goes down 4,000 metres.',
  },
  wordmarkHtml: 'ABYSS<b>A</b>L',
  nav: [
    { label: 'Twilight', href: '#twilight' },
    { label: 'Midnight', href: '#midnight' },
    { label: 'Abyss', href: '#abyss' },
    { label: 'Join', href: '#trench' },
  ],
  depth: { max: 4000, unit: 'M' },
  hero: {
    zoneTag: 'Sunlight Zone · 0–200m',
    headingHtml: 'Scroll down.<br><em>All the way down.</em>',
    subHtml:
      'ABYSSAL is a research institute for the deep ocean — the <b>95% of the biosphere</b> that has never seen a sunrise. This page descends 4,000 metres. Watch the light go.',
    descend: { label: 'Begin descent', href: '#twilight' },
  },
  zones: [
    {
      id: 'twilight',
      depthLabel: '— 200M · TWILIGHT ZONE',
      headingHtml: 'Where the light gives up,<br>the lanterns begin.',
      bodyHtml:
        'Below 200 metres, sunlight becomes rumor. Nine of every ten animals here <b>make their own light</b> — for hunting, for courtship, for lying about their size. We catalogue their signals like a phrasebook.',
      fact: 'Field note 114: the lanternfish\'s blink pattern is unique per individual. We have started giving them call signs.',
      creature: 'jelly',
    },
    {
      id: 'midnight',
      depthLabel: '— 1,000M · MIDNIGHT ZONE',
      headingHtml: 'No sun. No seasons.<br>No idea what\'s down here.',
      bodyHtml:
        'Permanent dark, four-degree water, pressure that folds steel. Our drones have logged <b>1,400 hours</b> in the midnight zone and still film a new species roughly every nine dives.',
      fact: 'Field note 207: the anglerfish\'s lure flickers at 4Hz. Our camera\'s status LED flickers at 4Hz. They keep proposing to the drone.',
      creature: 'angler',
      flip: true,
    },
    {
      id: 'abyss',
      depthLabel: '— 4,000M · THE ABYSS',
      headingHtml: 'The quietest place<br>with the oldest residents.',
      bodyHtml:
        'The abyssal plain: a desert the size of every continent combined. Life here runs slow and long — corals older than writing, sharks that predate the rings of Saturn\'s discovery by <b>four centuries of lifespan</b>.',
      fact: 'Field note 333: dropped a wrench in 2019. It has become a landmark. The crabs hold meetings at the wrench.',
      creature: 'siphon',
    },
  ],
  trench: {
    id: 'trench',
    headingHtml: 'You made it to <em>the bottom.</em>',
    body: '4,000 metres. Most people stop at the fold. If you read this far, you\'re our kind of curious — the institute takes six research fellows each year, and the application starts with one question: what would you look for down here?',
    cta: { label: 'Apply for a fellowship', href: '#' },
  },
  footer: {
    noteHtml: 'RV Fable Deep, Pier 9 · A fictional institute<br>The ocean, however, is real and enormous.',
    creditHtml: 'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
};
