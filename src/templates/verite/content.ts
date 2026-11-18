/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<a>/<br> only). */
export interface Link {
  label: string;
  href: string;
}

/** Duotone scene drawn into a film frame by scenes.ts. */
export type SceneKind = 'lighthouse' | 'window' | 'road' | 'sea';

export interface Film {
  scene: SceneKind;
  title: string;
  /** Right-hand caption, e.g. "1971 · 96 MIN". */
  meta: string;
}

/** One rolling-credits entry: small amber role over a large serif name. */
export interface Credit {
  role: string;
  name: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Wordmark in nav + footer, e.g. `VERIT<i>É</i>` (the <i> is the amber italic accent). */
  wordmarkHtml: string;
  nav: Link[];
  hero: {
    /** Top letterbox bar label (left). */
    reel: string;
    /** Bottom letterbox bar label (right). */
    runtime: string;
    pre: string;
    headingHtml: string;
    sub: string;
    foot: string;
  };
  films: {
    kicker: string;
    headingHtml: string;
    items: Film[];
    note: string;
  };
  method: {
    kicker: string;
    /** Blockquote body including its typographic quotes. */
    quoteHtml: string;
    cite: string;
  };
  credits: {
    /** aria-label of the rolling-credits region. */
    label: string;
    /** Credits in roll order. */
    entries: Credit[];
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
    /** Closing credit, set after a gap at the end of the roll. */
    credit: Credit;
  };
}

export const demo: Content = {
  seo: {
    title: 'VERITÉ — A Film Studio',
    description:
      'VERITÉ makes slow films on real film. Silver halide, amber light, and end credits that thank the weather. Grain rendered live.',
    ogTitle: 'VERITÉ — A Film Studio',
    ogDescription: 'Slow films on real film. The grain is live.',
  },
  wordmarkHtml: 'VERIT<i>É</i>',
  nav: [
    { label: 'The Films', href: '#films' },
    { label: 'Method', href: '#method' },
    { label: 'Credits', href: '#credits' },
  ],
  hero: {
    reel: 'Reel 1 of 1',
    runtime: 'RUNTIME: AS LONG AS IT NEEDS',
    pre: 'A Fictional Studio Presents',
    headingHtml: 'VERIT<i>É</i>',
    sub: 'slow films, shot on real film',
    foot: 'EST. 1963 · 16MM & 35MM · THE GRAIN ON THIS PAGE IS LIVE',
  },
  films: {
    kicker: 'Selected Works',
    headingHtml: 'Four films, <em>one apology to distributors.</em>',
    items: [
      { scene: 'lighthouse', title: 'The Keeper', meta: '1971 · 96 MIN' },
      { scene: 'window', title: 'Marguerite, Waiting', meta: '1978 · 143 MIN' },
      { scene: 'road', title: 'Route Nationale', meta: '1985 · 121 MIN' },
      { scene: 'sea', title: 'The Long Ferry', meta: '1994 · 187 MIN' },
    ],
    note: 'One shot per film. That\'s roughly the editing budget, too.',
  },
  method: {
    kicker: 'The Method',
    quoteHtml:
      '“Digital remembers everything instantly. Film has to <em>decide what mattered</em> — one frame, twenty-four times a second. So do we.”',
    cite: '— The Founder, interviewed 1989, still not finished answering',
  },
  credits: {
    label: 'Rolling credits',
    entries: [
      { role: 'Written & Directed by', name: 'Claude Fable 5' },
      { role: 'Director of Photography', name: 'A Fragment Shader' },
      { role: 'Production Design', name: 'Two CSS Bars & a Radial Gradient' },
      { role: 'The Grain', name: '2,000 Random Pixels Per Frame' },
      { role: 'Costumes', name: 'Playfair Display (Italic)' },
      { role: 'Location Scout', name: 'Your Browser' },
      { role: 'Catering', name: 'Netlify Free Tier' },
      { role: 'Special Thanks', name: 'The Weather, For Waiting' },
      { role: 'No Films Were Harmed', name: 'Some Were Slowed Considerably' },
    ],
  },
  footer: {
    noteHtml:
      'A fictional studio. The patience is real.<br>Screenings by appointment; projector warms up in eight minutes.',
    creditHtml: 'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
  showcase: {
    chipLabel: '← Fable Showcase',
    chipHref: '/',
    footerHtml: 'Part of the <a href="/">Fable Showcase</a> — 25 sites, 25 styles.',
    credit: { role: 'Part of', name: 'The Fable Showcase — 25 Sites, 25 Styles' },
  },
};
