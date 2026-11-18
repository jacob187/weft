/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<br>/<a>/<span> only). */
export interface Link {
  label: string;
  href: string;
}

/** Line icon drawn on an experience card. */
export type ExperienceIcon = 'sauna' | 'plunge' | 'lodge';

export interface Experience {
  /** Italic index in the card's top-right corner, e.g. "No. 1". */
  no: string;
  icon: ExperienceIcon;
  title: string;
  text: string;
  /** Pill under the text, e.g. "+85°C". */
  temp: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Room {
  /** Large italic index shown left of the room (hidden below 900px). */
  no: string;
  name: string;
  description: string;
  price: string;
  href: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Brand wordmark in the nav and footer; the <b> is tinted mint. */
  wordmarkHtml: string;
  /** Section anchors available: #experience, #forecast, #rooms. Nav is hidden below 900px. */
  nav: Link[];
  hero: {
    kicker: string;
    headingHtml: string;
    sub: string;
    cta: Link;
    /** Coordinates line, bottom-left of the hero. */
    coord: string;
    scrollLabel: string;
  };
  experience: { kicker: string; headingHtml: string; items: Experience[] };
  forecast: {
    kicker: string;
    headingHtml: string;
    /** Geomagnetic index (0–9): drives the gauge and the first stat. */
    kp: number;
    /** Label under the gauge number (upper case). */
    gaugeLabel: string;
    /** Label of the KP stat in the side list. */
    kpLabel: string;
    noteHtml: string;
    /** Further stats listed after the KP stat. */
    stats: Stat[];
  };
  rooms: { kicker: string; headingHtml: string; items: Room[] };
  footer: { addressHtml: string; creditHtml: string };
  /** Showcase-only chrome; rendered only when the Template receives `showcase`. */
  showcase?: { chipLabel: string; chipHref: string; footerHtml: string };
}

export const demo: Content = {
  seo: {
    title: 'AURORA — A Retreat Above the Arctic Circle',
    description:
      'AURORA is a wellness retreat at 68.4°N. Sauna beneath the northern lights, silence by the fjord, and a sky that performs every clear night.',
    ogTitle: 'AURORA — A Retreat Above the Arctic Circle',
    ogDescription: 'A live WebGL aurora over a Nordic fjord. Sauna beneath the lights.',
  },
  wordmarkHtml: 'AUROR<b>A</b>',
  nav: [
    { label: 'Experience', href: '#experience' },
    { label: "Tonight's Sky", href: '#forecast' },
    { label: 'Stay', href: '#rooms' },
  ],
  hero: {
    kicker: '68.4°N · Lofoten, Norway',
    headingHtml: 'The sky performs.<br><em>You unwind.</em>',
    sub: 'Eight cabins, one sauna, zero streetlights. Above you, the longest-running light show on Earth — rendered live on this page, as it will be on your first night.',
    cta: { label: 'Book a winter', href: '#rooms' },
    coord: '68.4193° N, 14.5731° E',
    scrollLabel: 'Scroll',
  },
  experience: {
    kicker: 'The Experience',
    headingHtml: 'Warmth, cold, and <em>silence</em> —<br>in that order.',
    items: [
      {
        no: 'No. 1',
        icon: 'sauna',
        title: 'Sky Sauna',
        text: 'A cedar sauna with a glass roof, fired to 85° while the aurora rolls overhead. We schedule sessions by the solar wind, not the clock.',
        temp: '+85°C',
      },
      {
        no: 'No. 2',
        icon: 'plunge',
        title: 'Fjord Plunge',
        text: 'Two minutes in four-degree water, guided, gasping, grinning. The fastest way home your nervous system has ever taken.',
        temp: '+4°C',
      },
      {
        no: 'No. 3',
        icon: 'lodge',
        title: 'Silent Lodge',
        text: 'No phones past the cloakroom. No music. Just the stove ticking, snow settling on the roof, and a library of unread books.',
        temp: '0 dB',
      },
    ],
  },
  forecast: {
    kicker: "Tonight's Sky",
    headingHtml: 'Aurora forecast, <em>live-ish.</em>',
    kp: 4.3,
    gaugeLabel: 'KP INDEX',
    kpLabel: 'KP Index',
    noteHtml:
      'The <b>KP index</b> measures geomagnetic storm strength from 0 to 9. Above <b>KP 3</b>, the lights clear our southern ridge. Above 5, guests have been known to skip dinner. The sky on this page mirrors tonight\'s mood.',
    stats: [
      { value: '96%', label: 'Clear-sky odds' },
      { value: '17:41', label: 'Civil darkness' },
      { value: '−12°C', label: 'Outside now' },
    ],
  },
  rooms: {
    kicker: 'Stay',
    headingHtml: 'Eight cabins, <em>one sky.</em>',
    items: [
      {
        no: '01',
        name: 'Fjordhytte',
        description: 'Sleeps two · floor-to-ceiling north glazing · wood stove',
        price: 'FROM €340 / NIGHT',
        href: '#',
      },
      {
        no: '02',
        name: 'Himmelrom',
        description: 'Sleeps two · glass ceiling over the bed · aurora wake-up call',
        price: 'FROM €420 / NIGHT',
        href: '#',
      },
      {
        no: '03',
        name: 'Nordlys Suite',
        description: 'Sleeps four · private sauna · the ridge to yourself',
        price: 'FROM €610 / NIGHT',
        href: '#',
      },
    ],
  },
  footer: {
    addressHtml: 'Skrova, Lofoten, Norway<br>Open October through March.',
    creditHtml: 'A fictional retreat, designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
  showcase: {
    chipLabel: '← Fable Showcase',
    chipHref: '/',
    footerHtml: 'Part of the <a href="/">Fable Showcase</a> — 25 sites, 25 styles.',
  },
};
