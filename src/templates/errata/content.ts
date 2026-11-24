/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<u>/<mark>/<span>/<br>/<a> only). */
export interface Link {
  label: string;
  href: string;
}

/** Where a draggable window sits in the hero desk. Lengths are CSS values. Collapsed to a stack on mobile. */
export interface Placement {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  maxWidth: string;
  /** Initial stacking order. */
  z: number;
  /** Tilt in degrees. */
  rotate?: number;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Logo in nav + footer, e.g. `ERRATA<i>***</i>` (the <i> is red). */
  wordmarkHtml: string;
  nav: {
    /** Text scrolling along the top bar; repeated to fill the width. */
    ticker: string;
    links: Link[];
  };
  desk: {
    /** Glyph on every window's close box. */
    closeGlyph: string;
    /** Glyph that trails the cursor on fine-pointer devices. */
    trailGlyph: string;
    /** Bottom hint bar (desktop only). */
    hintHtml: string;
    manifesto: {
      title: string;
      placement: Placement;
      headingHtml: string;
      text: string;
      stamp: string;
    };
    evidence: {
      title: string;
      placement: Placement;
      /** Caption above the drawing. */
      caption: string;
    };
    doNot: {
      title: string;
      placement: Placement;
      lead: string;
      button: string;
      /** Shown as `(${counterLabel} N)`. */
      counterLabel: string;
    };
    quote: {
      title: string;
      placement: Placement;
      quoteHtml: string;
    };
    /** Windows spawned by the button. Title/body cycle by click number. */
    spawn: {
      titles: string[];
      bodies: string[];
      /** Click number that also raises the "intervention" window. */
      interventionAt: number;
      intervention: { title: string; heading: string; text: string };
    };
  };
  rules: {
    headingHtml: string;
    /** Numbered 1…n automatically. */
    rants: { html: string }[];
  };
  specimen: {
    headingHtml: string;
    /** Tag pinned to the box's corner. */
    note: string;
    /** Up to four lines, each set in its own typeface. */
    lines: string[];
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
    title: 'ERRATA*** — an anti-design laboratory',
    description:
      'ERRATA is an anti-design laboratory. Drag the windows. Click the button you shouldn\'t. Every mistake on this page is load-bearing.',
    ogTitle: 'ERRATA*** — an anti-design laboratory',
    ogDescription: 'Every mistake on this page is load-bearing.',
  },
  wordmarkHtml: 'ERRATA<i>***</i>',
  nav: {
    ticker:
      'THIS SITE PASSED ZERO DESIGN REVIEWS AND IT KNOWS IT  ///  KERNING IS A SOCIAL CONSTRUCT  ///  ',
    links: [
      { label: 'rules.txt', href: '#rules' },
      { label: 'fonts.exe', href: '#specimen' },
    ],
  },
  desk: {
    closeGlyph: '✕',
    trailGlyph: '*',
    hintHtml: '<b>drag</b> the windows · <b>close</b> them · nothing is precious',
    manifesto: {
      title: 'manifesto_FINAL_v9(2).doc',
      placement: { left: '6%', top: '16%', maxWidth: '560px', z: 3 },
      headingHtml: 'DESIGN IS<br><em>WRONG</em> HERE<br><u>ON PURPOSE.</u>',
      text: 'welcome to ERRATA, an anti-design laboratory. the windows drag. the button lies. nothing aligns except our intentions.',
      stamp: '100% GRID-FREE†',
    },
    evidence: {
      title: 'evidence.jpg',
      placement: { right: '8%', top: '12%', maxWidth: '300px', z: 2 },
      caption: 'fig. 1 — a perfectly good grid, ignored:',
    },
    doNot: {
      title: 'do_not.app',
      placement: { left: '38%', top: '56%', maxWidth: '340px', z: 4 },
      lead: 'whatever you do,',
      button: 'DO NOT CLICK',
      counterLabel: 'windows spawned so far:',
    },
    quote: {
      title: 'quote.txt',
      placement: { right: '20%', bottom: '10%', maxWidth: '260px', z: 2, rotate: 1.6 },
      quoteHtml:
        '"the first rule of design club is you must know the rules to break them.<br><br>we know them. <span class="red">personally.</span>"',
    },
    spawn: {
      titles: ['regret.log', 'oops_v2.tmp', 'untitled(7).png', 'alignment.404', 'final_FINAL.doc', 'kerning.zip'],
      bodies: [
        'you clicked it.',
        'this window is your fault.',
        'we told you not to.',
        'somewhere, a grid weeps.',
        'the button remains unrepentant.',
        'this one has no close button. kidding. or are we.',
      ],
      interventionAt: 12,
      intervention: {
        title: 'intervention.sys',
        heading: 'OKAY. THAT\'S ENOUGH.',
        text: 'even chaos has a budget. go read the rules below.',
      },
    },
  },
  rules: {
    headingHtml: 'the rules <mark>(broken lovingly)</mark>',
    rants: [
      {
        html: '<b>ALIGNMENT:</b> our elements are aligned to how the day is going. today the day is going like <i>this</i>, slightly to the left and down.',
      },
      {
        html: '<b>HIERARCHY:</b> everything on this page is the most important thing on this page. especially <a href="#">this link that goes nowhere</a>.',
      },
      {
        html: '<b>WHITESPACE:</b> we respect whitespace so much we refuse to use it up. it\'s all still there. somewhere. saved for later.',
      },
      {
        html: '<b>CONSISTENCY:</b> we are extremely consistent about being inconsistent, which — if you think about it — <i>don\'t</i>.',
      },
      {
        html: '<b>THE ASTERISK:</b> every claim on this site has an asterisk.*** the asterisks lead nowhere. this is called <b>mystery</b>.',
      },
    ],
  },
  specimen: {
    headingHtml: 'one sentence, <mark>four fonts,</mark> zero remorse',
    note: 'typography dept.',
    lines: ['GRAPHIC DESIGN', 'is my passion,', 'ALLEGEDLY,', 'AND IT SHOWS.'],
  },
  footer: {
    noteHtml: 'a fictional laboratory. the chaos is calibrated.<br>*** the asterisks still lead nowhere.',
    creditHtml: 'original design by <a href="https://github.com/BrainwavePro">BrainwavePro</a>',
  },
  showcase: {
    chipLabel: '← weft',
    chipHref: '/',
    footerHtml: 'part of <a href="/">Weft</a> — 25 sites, 25 styles.',
  },
};
