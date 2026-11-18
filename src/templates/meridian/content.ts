/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<a>/<br> only). */
export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  masthead: {
    /** Blue label at the top-left of the masthead strip. */
    issue: string;
    /** Centre label of the masthead strip. */
    season: string;
    /** Publication name set huge; collapses to a slim bar on scroll. */
    name: string;
    /** Blue punctuation mark after the name. */
    mark: string;
    /** Right-aligned tagline beside the name (hidden below 760px). `<br>` allowed. */
    taglineHtml: string;
  };
  lead: {
    /** Small blue category label. */
    category: string;
    /** Cover-story headline; `<em>` renders light italic. */
    headingHtml: string;
    standfirst: string;
    /** `<b>` renders darker. */
    bylineHtml: string;
    cta: { label: string; href: string };
    figure: {
      /** Bold label before the caption, e.g. "Fig. 01". */
      label: string;
      caption: string;
      /** Right-aligned note in the caption row. */
      note: string;
    };
  };
  features: {
    title: string;
    /** Right-aligned note on the section rule. */
    note: string;
    stories: {
      /** Blue story number. */
      no: string;
      title: string;
      summary: string;
      /** Section and reading time, e.g. "Systems · 18 min". */
      meta: string;
      href: string;
    }[];
  };
  quote: {
    /** Pull quote; `<b>` renders heavy upright. */
    textHtml: string;
    cite: string;
  };
  index: {
    /** Anchor id targeted by the lead CTA. */
    id: string;
    /** Sticky heading beside the list; `<br>` and a `<span>` accent mark allowed. */
    headingHtml: string;
    rows: {
      label: string;
      /** Big blue figure on the right. */
      value: string;
    }[];
  };
  /**
   * Colophon columns. When the page is rendered with `showcase`, the showcase credit line is
   * appended to the last block.
   */
  colophon: {
    label: string;
    /** `<br>` and `<a>` allowed. */
    bodyHtml: string;
  }[];
}

export const demo: Content = {
  seo: {
    title: 'MERIDIAN — Issue 07: The Slow Number',
    description:
      'MERIDIAN is a quarterly magazine of systems, cities, and quiet numbers. Issue 07: The Slow Number.',
    ogTitle: 'MERIDIAN — Issue 07',
    ogDescription: 'A quarterly of systems, cities, and quiet numbers.',
  },
  masthead: {
    issue: 'Issue 07 — The Slow Number',
    season: 'Autumn Quarter · MMXXVI',
    name: 'MERIDIAN',
    mark: '.',
    taglineHtml: 'A quarterly of systems,<br>cities &amp; quiet numbers',
  },
  lead: {
    category: 'Cover story',
    headingHtml: 'The city that<br>decided to <em>count slower.</em>',
    standfirst:
      'In 2019, a mid-sized Swiss canton quietly removed real-time dashboards from its transit authority and replaced them with a weekly paper report. Delays went up by nothing. Decisions got better by a lot. We spent a season with the people who unplugged the feed.',
    bylineHtml: 'By <b>L. Aebischer</b> · Photographs <b>R. Vogt</b> · 24 min',
    cta: { label: 'Read the issue', href: '#index' },
    figure: {
      label: 'Fig. 01',
      caption: 'Departure board, unplugged. Aarau.',
      note: 'IKB duotone',
    },
  },
  features: {
    title: 'In this issue',
    note: 'Six features · One argument',
    stories: [
      {
        no: '02',
        title: 'Spreadsheets of the dead: who maintains the pension math',
        summary:
          'Every retirement system rests on four assumptions and one actuary who is about to retire herself.',
        meta: 'Systems · 18 min',
        href: '#',
      },
      {
        no: '03',
        title: 'The last human timetable in the Alps',
        summary:
          'One woman, four valleys, sixty years of bus schedules written first in pencil. An audit, and an apology.',
        meta: 'Cities · 12 min',
        href: '#',
      },
      {
        no: '04',
        title: 'Benchmarks considered harmful, benchmarks considered lovely',
        summary:
          'A double review: the metric that ruined a hospital, and the identical metric that saved a ferry line.',
        meta: 'Argument · 15 min',
        href: '#',
      },
      {
        no: '05',
        title: 'An interview with the keeper of the second',
        summary: 'Inside the basement lab where the SI second is bred, fed, and occasionally leap-adjusted.',
        meta: 'Interview · 20 min',
        href: '#',
      },
      {
        no: '06',
        title: 'Deceleration diary: thirty days without a dashboard',
        summary: 'Our editor removed every live chart from her life. Day nine is where it gets strange.',
        meta: 'Diary · 9 min',
        href: '#',
      },
      {
        no: '07',
        title: 'The colophon as confession',
        summary: "What a magazine's smallest page says about everything it was too polite to print earlier.",
        meta: 'Craft · 6 min',
        href: '#',
      },
    ],
  },
  quote: {
    textHtml:
      '“A number you check every minute is a <b>pulse.</b> A number you check every season is a <b>direction.</b> Most organisations confuse the two, then hire consultants to find their way.”',
    cite: '— From the cover story, p. 34',
  },
  index: {
    id: 'index',
    headingHtml: 'The<br>Meridian<br>Index<span>.</span>',
    rows: [
      {
        label: 'Years the average “real-time” dashboard survives before quiet abandonment',
        value: '2.3',
      },
      { label: 'Minutes per day the Aarau transit staff spent watching the old feed', value: '74' },
      {
        label: 'Minutes per week they spend reading the paper report that replaced it',
        value: '40',
      },
      { label: 'Change in average bus delay after the switch, in seconds', value: '+11' },
      { label: 'Change in fleet-planning errors, year over year', value: '−38%' },
      { label: 'Pages in the weekly report, by charter, forever', value: '4' },
      {
        label: 'Dashboards this magazine consulted while fact-checking that number',
        value: '0',
      },
      { label: 'Espressos consumed per issue by the fact-checking department', value: '312' },
    ],
  },
  colophon: [
    {
      label: 'Masthead',
      bodyHtml:
        'MERIDIAN. — a fictional quarterly.<br>Set in Inter Tight on a 12-column grid.<br>Printed nowhere; rendered everywhere.',
    },
    {
      label: 'Edition',
      bodyHtml: 'Issue 07, Autumn MMXXVI.<br>“The Slow Number.”<br>Cover ink: International Klein Blue.',
    },
    {
      label: 'Colophon',
      bodyHtml: 'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>.',
    },
  ],
};
