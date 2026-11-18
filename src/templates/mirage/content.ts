/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<br>/<a> only). */
export interface Link {
  label: string;
  href: string;
}

/** Line-art cover drawing for a drop (generated SVG in drops.ts). */
export type DropArt = 'cassette' | 'vhs' | 'minidisc';

export interface Drop {
  title: string;
  /** Format line under the title, e.g. "Cassette · C60 · Chrome". */
  format: string;
  /** Price line in peach. */
  price: string;
  art: DropArt;
  /** Short text printed on the drawn cover (cassette label, tape sticker, disc shutter). */
  artLabel: string;
}

export interface Transmission {
  /** Schedule block in the left column; use <br> for the second line. */
  whenHtml: string;
  title: string;
  body: string;
  /** Right-aligned location tag. */
  place: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Logo text in nav + footer. */
  logo: string;
  nav: Link[];
  hero: {
    /** Chrome headline over the sunset. */
    title: string;
    /** Spaced-out subtitle under the headline. */
    subtitle: string;
    tagHtml: string;
  };
  drops: {
    id: string;
    kicker: string;
    headingHtml: string;
    items: Drop[];
  };
  manifesto: {
    id: string;
    kicker: string;
    /** The quote, including its typographic quote marks; wrap emphasis in <b>. */
    quoteHtml: string;
    cite: string;
  };
  transmissions: {
    id: string;
    kicker: string;
    headingHtml: string;
    items: Transmission[];
  };
  footer: {
    noteHtml: string;
    creditHtml: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'MIRAGE — A Vaporwave Collective',
    description:
      'MIRAGE is a collective for sunsets that never happened. Chrome type, checkerboard horizons, and music for malls that no longer exist.',
    ogTitle: 'MIRAGE — A Vaporwave Collective',
    ogDescription: 'Sunsets that never happened. Est. never, active always.',
  },
  logo: 'MIRAGE',
  nav: [
    { label: 'Drops', href: '#drops' },
    { label: 'Manifesto', href: '#manifesto' },
    { label: 'Transmissions', href: '#transmissions' },
  ],
  hero: {
    title: 'MIRAGE',
    subtitle: '蜃気楼コレクティブ',
    tagHtml: 'music for malls that <b>never existed</b> · est. never, active always',
  },
  drops: {
    id: 'drops',
    kicker: 'Latest Drops',
    headingHtml: 'Formats nobody asked for, <em>lovingly restored.</em>',
    items: [
      {
        title: 'Palm Court Radio Vol. IV',
        format: 'Cassette · C60 · Chrome',
        price: '$12 — includes B-side of rain',
        art: 'cassette',
        artLabel: 'VOL. IV',
      },
      {
        title: 'Sunset Screensaver (Extended)',
        format: 'VHS · 4 HRS · SP mode',
        price: '$18 — tracking issues guaranteed',
        art: 'vhs',
        artLabel: 'SUNSET ∞',
      },
      {
        title: 'Fountain Ambience 東京 \'89',
        format: 'MiniDisc · 74 MIN',
        price: '$15 — player sold separately, forever',
        art: 'minidisc',
        artLabel: '東京 \'89',
      },
    ],
  },
  manifesto: {
    id: 'manifesto',
    kicker: 'Manifesto',
    quoteHtml:
      '“Nostalgia for things that never happened is still nostalgia. We make <b>the soundtrack for the memory you almost had</b> — the arcade after close, the fountain at the dead mall, the sun that sets but never finishes.”',
    cite: '— MIRAGE COLLECTIVE, TRANSMISSION ZERO',
  },
  transmissions: {
    id: 'transmissions',
    kicker: 'Transmissions',
    headingHtml: 'Live, <em>loosely speaking.</em>',
    items: [
      {
        whenHtml: 'FRI 23:00<br>FOREVER',
        title: 'Poolside FM Takeover',
        body: 'Four hours of slowed funk broadcast from a hotel pool that closed in 1994.',
        place: 'WEBSTREAM',
      },
      {
        whenHtml: 'FULL MOON<br>MONTHLY',
        title: 'Parking Garage Ambient',
        body: 'Level B2. Bring a lawn chair. The reverb does the rest.',
        place: 'IRL · SECRET',
      },
      {
        whenHtml: 'SUN 06:00<br>WEEKLY',
        title: 'Sunrise Rewind',
        body: 'We play the sunset set backwards and see who notices. Someone always cries.',
        place: 'ROOFTOP',
      },
    ],
  },
  footer: {
    noteHtml: 'A fictional collective, rendered in pure CSS 3D.<br>The sunset is 100% gradient. No images were harmed.',
    creditHtml: 'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
};
