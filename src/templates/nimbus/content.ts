/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<a>/<br> only). */
export interface Link {
  label: string;
  href: string;
}

/** Sky moods the shader knows how to render. Colors for each live in theme.css as `--<id>-top|bot|lit|shade`. */
export type MoodId = 'dawn' | 'storm' | 'rain';

export interface Mood {
  id: MoodId;
  /** Emoji/glyph beside the label. */
  icon: string;
  label: string;
  /** Small line under the label. */
  hint: string;
}

export interface Feature {
  /** Small italic counter, e.g. "No. 1". */
  no: string;
  title: string;
  text: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Wordmark in nav + footer, e.g. `nimbus<i>.</i>` (the <i> is the accent dot). */
  wordmarkHtml: string;
  /** In-page nav. Sections carry the ids `why`, `words` and `get`. */
  nav: Link[];
  hero: {
    /** aria-label of the sky canvas. */
    skyLabel: string;
    headingHtml: string;
    text: string;
    /** aria-label of the mood button group. */
    moodsLabel: string;
    /** Small caption above the mood buttons. */
    moodsCaption: string;
    /** Mood buttons in display order; the first is selected on load and must be 'dawn'. */
    moods: Mood[];
  };
  why: {
    kicker: string;
    headingHtml: string;
    features: Feature[];
  };
  words: {
    kicker: string;
    /** Blockquote body including its typographic quotes. */
    quoteHtml: string;
    cite: string;
  };
  get: {
    heading: string;
    text: string;
    cta: Link;
  };
  footer: {
    noteHtml: string;
    creditHtml: string;
  };
  /** Showcase-only chrome; rendered when the template's `showcase` prop is true. */
  showcase?: {
    chipLabel: string;
    chipHref: string;
    footerHtml: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'NIMBUS — Weather for the Inside of Your Head',
    description:
      'NIMBUS renders living skies in WebGL — dawn, storm, and rain on demand. An atmosphere app for people whose weather is mostly internal.',
    ogTitle: 'NIMBUS — Weather for the Inside of Your Head',
    ogDescription: 'Living skies in WebGL. Dawn, storm, and rain on demand.',
  },
  wordmarkHtml: 'nimbus<i>.</i>',
  nav: [
    { label: 'Why', href: '#why' },
    { label: 'Words', href: '#words' },
    { label: 'Get it', href: '#get' },
  ],
  hero: {
    skyLabel: 'Live procedural sky that changes with the selected weather mood',
    headingHtml: 'Weather for the<br><em>inside of your head.</em>',
    text: 'The sky above is not a video — it\'s mathematics, drifting in real time. Pick the weather that matches the one behind your eyes.',
    moodsLabel: 'Weather mood',
    moodsCaption: 'Choose your sky',
    moods: [
      { id: 'dawn', icon: '☀', label: 'Golden Dawn', hint: 'for slow mornings' },
      { id: 'storm', icon: '⛈', label: 'Rolling Storm', hint: 'for deadlines' },
      { id: 'rain', icon: '🌧', label: 'Steady Rain', hint: 'for everything else' },
    ],
  },
  why: {
    kicker: 'The Idea',
    headingHtml: 'Some days need <em>a different sky.</em>',
    features: [
      {
        no: 'No. 1',
        title: 'Skies, not screensavers',
        text: 'Every cloud is fractal noise computed this very frame. No loops, no seams, no two skies ever the same — like the real thing, minus the commute.',
      },
      {
        no: 'No. 2',
        title: 'Sound to match',
        text: 'Each mood ships with a generative soundscape — dawn birds that never repeat, thunder that keeps a polite distance, rain with adjustable heaviness.',
      },
      {
        no: 'No. 3',
        title: 'The 20-minute window',
        text: 'Set a timer and the sky completes an arc — storm clears, dawn warms, rain softens — nudging your head toward wherever you aimed it.',
      },
    ],
  },
  words: {
    kicker: 'Words',
    quoteHtml:
      '“I keep the storm on while I work. My thoughts pace around like the thunder — <em>at a distance, getting things done.</em>”',
    cite: '— A beta tester, allegedly a novelist',
  },
  get: {
    heading: 'The sky is already running.',
    text: 'NIMBUS is a fictional app, but the atmosphere is real — this page\'s sky will keep drifting for as long as you leave the tab open. Some people do.',
    cta: { label: 'Get Nimbus (someday)', href: '#' },
  },
  footer: {
    noteHtml: 'A fictional atmosphere company.<br>Clouds computed locally. Feelings may vary.',
    creditHtml: 'Original design by <a href="https://github.com/BrainwavePro">BrainwavePro</a>',
  },
  showcase: {
    chipLabel: '← Weft',
    chipHref: '/',
    footerHtml: 'Part of <a href="/">Weft</a> — 25 sites, 25 styles.',
  },
};
