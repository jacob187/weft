import { stylizedAnomalies, stylizedKeeling } from './data';

/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<br>/<a>/<i> only). */
export interface Link {
  label: string;
  href: string;
}

/** One year of the temperature record. */
export interface Anomaly {
  year: number;
  /** Temperature anomaly relative to the baseline, in the unit of `Content.climate.unit`. */
  value: number;
}

/** A dashed reference ring on the spiral. */
export interface SpiralRing {
  /** Anomaly value the ring is drawn at. */
  value: number;
  label: string;
}

/** A CO₂ series sampled at evenly spaced points from `startYear` to `endYear`. */
export interface KeelingSeries {
  startYear: number;
  endYear: number;
  ppm: number[];
  /** Value range mapped to the chart height. */
  min: number;
  max: number;
  /** Values that get a dashed gridline and label. */
  gridlines: number[];
  unit: string;
}

export interface Stat {
  /** Number the count-up animates to. */
  value: number;
  /** Decimal places shown while counting. */
  decimals?: number;
  /** Text right after the number, including any leading space (e.g. " ppm"). */
  suffix?: string;
  label: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Wordmark in nav + footer; wrap the gradient part in <i>. */
  wordmarkHtml: string;
  nav: Link[];
  /** Datasets that drive the charts. Swap these to chart different data. */
  climate: {
    /** Unit appended to anomaly readouts, e.g. "°C". */
    unit: string;
    /** Yearly anomalies, oldest first. Feeds the stripes and the spiral. */
    anomalies: Anomaly[];
    /**
     * Anomaly values at which the color scale is pinned, ascending. The N-th value takes the color
     * `--scale-N` from theme.css (so exactly six values), blended linearly in between.
     */
    scaleStops: number[];
  };
  hero: {
    kicker: string;
    headingHtml: string;
    subHtml: string;
    /** aria-label of the stripes canvas. */
    stripesLabel: string;
    /** Readout shown while no stripe is hovered. */
    stripesIdle: string;
  };
  spiral: {
    id: string;
    headingHtml: string;
    /** aria-label of the spiral canvas. */
    label: string;
    /** Copy paragraphs; `{year}` is replaced by the live year readout. */
    paragraphsHtml: string[];
    /** Twelve month labels around the dial, starting at the top. */
    months: string[];
    rings: SpiralRing[];
    /** Legend swatches under the copy; `tone` picks the `--cold`/`--warm`/`--crit` token. */
    legend: { label: string; tone: 'cold' | 'warm' | 'crit' }[];
  };
  keeling: {
    id: string;
    headingHtml: string;
    bodyHtml: string;
    series: KeelingSeries;
    /** Captions under the chart: left, center, right. */
    captions: [string, string, string];
  };
  stats: {
    id: string;
    headingHtml: string;
    items: Stat[];
    note: string;
  };
  footer: {
    noteHtml: string;
    creditHtml: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'FLUX — Climate Observatory',
    description:
      'FLUX renders the climate record as living graphics — warming stripes, the temperature spiral, and the long breath of the Keeling curve.',
    ogTitle: 'FLUX — Climate Observatory',
    ogDescription: 'The climate record as living graphics.',
  },
  wordmarkHtml: 'FL<i>UX</i>',
  nav: [
    { label: 'The Spiral', href: '#spiral-sec' },
    { label: 'The Curve', href: '#keeling' },
    { label: 'Numbers', href: '#numbers' },
  ],
  climate: {
    unit: '°C',
    anomalies: stylizedAnomalies(1880, 2025),
    scaleStops: [-0.5, -0.15, 0.1, 0.5, 1, 1.5],
  },
  hero: {
    kicker: 'Climate Observatory · Data as Design',
    headingHtml: 'A century and a half,<br><em>one stripe per year.</em>',
    subHtml:
      'FLUX turns the instrumental climate record into graphics you can feel. Below: every year since 1880, colored by its temperature anomaly. <b>Blue is cooler than the 20th-century average. Red is warmer. Hover them.</b>',
    stripesLabel: 'Warming stripes: annual temperature anomalies 1880 to 2025, cool blues shifting to hot reds',
    stripesIdle: 'hover a stripe',
  },
  spiral: {
    id: 'spiral-sec',
    headingHtml: 'The temperature <em>spiral.</em>',
    label: 'Climate spiral: monthly temperature anomalies spiraling outward from 1880 to 2025',
    paragraphsHtml: [
      'Twelve months around the dial, <b>146 years of rings</b>. Each loop is one year of monthly anomalies; the further from the center, the hotter the month. The spiral is currently drawing <span class="sp-year" id="spYear">{year}</span>.',
      'For decades the rings hug the center — a tight, cool coil. Then, around 1980, the line starts <b>reaching outward and never comes back.</b>',
    ],
    months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    rings: [
      { value: 0, label: '0°C' },
      { value: 1, label: '+1°C' },
    ],
    legend: [
      { label: '−0.5°C', tone: 'cold' },
      { label: '+0.75°C', tone: 'warm' },
      { label: '+1.5°C', tone: 'crit' },
    ],
  },
  keeling: {
    id: 'keeling',
    headingHtml: 'The long breath of <em>the Keeling curve.</em>',
    bodyHtml:
      'Atmospheric CO₂, measured continuously since 1958. The sawtooth is the Northern Hemisphere <b>inhaling every summer, exhaling every winter</b> — a planet breathing while the baseline climbs.',
    series: {
      startYear: 1958,
      endYear: 2025,
      ppm: stylizedKeeling(1958, 2025, 260),
      min: 305,
      max: 430,
      gridlines: [330, 360, 390, 420],
      unit: 'ppm',
    },
    captions: ['1958 · 315 ppm', 'MAUNA LOA (STYLIZED)', '2025 · ~425 ppm'],
  },
  stats: {
    id: 'numbers',
    headingHtml: 'Four numbers <em>we can\'t unknow.</em>',
    items: [
      { value: 1.4, decimals: 1, suffix: '°C', label: 'Warming since 1880 (global mean)' },
      { value: 425, suffix: ' ppm', label: 'CO₂ today — highest in 3M years' },
      { value: 10, suffix: '/10', label: 'Hottest years, all since 2014' },
      { value: 0, label: 'Years left where this is someone else\'s chart' },
    ],
    note: 'Data on this page is stylized from public climate records (NASA GISTEMP shape, Scripps Keeling curve shape) for design demonstration — for research, go to the sources. The trend, unfortunately, is faithful.',
  },
  footer: {
    noteHtml: 'A fictional observatory rendering real patterns.<br>Every chart hand-rolled in canvas &amp; SVG.',
    creditHtml: 'Original design by <a href="https://github.com/BrainwavePro">BrainwavePro</a>',
  },
};
