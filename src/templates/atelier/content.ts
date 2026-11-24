/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<br>/<span>/<a> only). */
export interface Link {
  label: string;
  href: string;
}

/** Which self-drawing line elevation to render. */
export type DrawingKind = 'house' | 'tower' | 'pavilion' | 'chapel' | 'bridge';

export interface Project {
  /** Plate number, e.g. "01". */
  no: string;
  name: string;
  /** Year and place line, e.g. "2024 · BASEL". */
  meta: string;
  description: string;
  drawing: DrawingKind;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Wordmark in the nav and footer; wrap the heavier word in `<b>`. */
  wordmarkHtml: string;
  nav: Link[];
  hero: {
    headingHtml: string;
    sub: string;
    /** Figures under the sub line. */
    stats: { value: string; label: string }[];
    drawing: DrawingKind;
    /** Left caption under the hero drawing. */
    figure: string;
    /** Right caption under the hero drawing, e.g. the drawing scale. */
    scale: string;
  };
  work: {
    /** Anchor id of the section head (nav links target it). */
    id: string;
    headingHtml: string;
    /** Hint beside the heading about the sideways-scrolling gallery. */
    hint: string;
    projects: Project[];
  };
  philosophy: {
    id: string;
    quoteHtml: string;
    cite: string;
  };
  practice: {
    id: string;
    columns: { label: string; bodyHtml: string }[];
  };
  footer: {
    note: string;
    /** Credit line; the showcase line is appended on showcase routes. */
    creditHtml: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'ATELIER NOIR — Architecture',
    description:
      'Atelier Noir draws buildings the old way — in line, in silence, in black on almost-white. Four projects, one obsession with shadow.',
    ogTitle: 'ATELIER NOIR — Architecture',
    ogDescription: 'Buildings drawn in line, in silence, in black on almost-white.',
  },
  wordmarkHtml: '<b>Atelier</b> Noir',
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Practice', href: '#practice' },
  ],
  hero: {
    headingHtml: 'We build<br>with <em>shadow.</em>',
    sub: 'Atelier Noir is a four-person architecture practice. We still begin every project the same way: one elevation, drawn in line, black on almost-white. The drawings on this page draw themselves — the buildings took slightly longer.',
    stats: [
      { value: '23', label: 'Built works' },
      { value: '4', label: 'People' },
      { value: '0', label: 'Renderings' },
    ],
    drawing: 'house',
    figure: 'Fig. 0 — The Long House, north elevation',
    scale: '1:200',
  },
  work: {
    id: 'work',
    headingHtml: 'Selected <em>works</em>',
    hint: 'Scroll sideways — like a drawing board →',
    projects: [
      {
        no: '01',
        name: 'Meridian Tower',
        meta: '2024 · BASEL',
        description:
          'Twenty-two storeys that step back three times, so the street keeps its morning sun. The planning office sent a thank-you card.',
        drawing: 'tower',
      },
      {
        no: '02',
        name: 'Pavilion of Small Rain',
        meta: '2023 · KYOTO',
        description:
          'A roof, twelve columns, and nothing else. Built for a garden that needed somewhere to stand when the weather performs.',
        drawing: 'pavilion',
      },
      {
        no: '03',
        name: 'Chapel of the Narrow Light',
        meta: '2021 · JUTLAND',
        description:
          'One window, nine metres tall, four centimetres wide. At noon in June the light reaches the back wall. People book years ahead for that minute.',
        drawing: 'chapel',
      },
      {
        no: '04',
        name: 'The Bridge House',
        meta: '2019 · TICINO',
        description:
          'A house that is also a footbridge. The river insisted on flowing through the site, so we let the living room span it.',
        drawing: 'bridge',
      },
    ],
  },
  philosophy: {
    id: 'philosophy',
    quoteHtml:
      '“A rendering promises. <em>A drawing admits.</em> We would rather be honest at 1:200 than persuasive in 4K.”',
    cite: '— Founding note, Atelier Noir, 2011',
  },
  practice: {
    id: 'practice',
    columns: [
      {
        label: 'The Practice',
        bodyHtml:
          'Founded 2011 in a former printing house. The presses left; the smell of ink stayed, and so did we. <b>Four architects, no juniors</b> — everyone draws, everyone answers the phone.',
      },
      {
        label: 'Method',
        bodyHtml:
          'Every project begins with <b>a week of drawing by hand</b>, and ends with us photographing the building in black and white before anyone moves in. What survives both is the architecture.',
      },
      {
        label: 'Contact',
        bodyHtml:
          'Druckereigasse 9, Basel<br><b>studio@ateliernoir.example</b><br>We reply in the afternoon. Mornings are for the board.',
      },
    ],
  },
  footer: {
    note: 'A fictional practice. The buildings, regrettably, remain drawings.',
    creditHtml: 'Original design by <a href="https://github.com/BrainwavePro">BrainwavePro</a>',
  },
};
