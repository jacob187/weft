import { templates } from '~/templates/registry';
import { demoPath } from '~/templates/types';

/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<a>/<br> only). */
export interface Link {
  label: string;
  href: string;
}

export interface GalleryItem {
  /** Big italic number on the swatch, e.g. "01". */
  no: string;
  name: string;
  summary: string;
  /** Pill in the swatch's top-right corner. */
  tag: string;
  /** Three swatch stripes; the middle one widens on hover. Also feeds the woven background. */
  swatch: [string, string, string];
  href: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Wordmark in nav + footer. */
  wordmarkHtml: string;
  nav: Link[];
  hero: {
    kicker: string;
    headingHtml: string;
    subHtml: string;
    primary: Link;
    secondary?: Link;
    note?: string;
  };
  /** Anchor id for the grid section (nav/CTA links target `#${gridId}`). */
  gridId: string;
  items: GalleryItem[];
  about: { headingHtml: string; bodyHtml: string };
  footer: { brandNoteHtml: string; creditHtml: string };
}

export const demo: Content = {
  seo: {
    title: 'The Fable Showcase — 25 Sites, 25 Styles, One Model',
    description:
      'Twenty-five fundamentally different websites — raymarched gold, particle constellations, working synthesizers, Bauhaus machines — designed and built autonomously by Claude Fable 5.',
    ogTitle: 'The Fable Showcase — 25 Sites, 25 Styles',
    ogDescription: 'Twenty-five fundamentally different websites, designed and built autonomously by Claude Fable 5.',
  },
  wordmarkHtml: 'The <em>Fable</em> Showcase',
  nav: [
    { label: 'The 25', href: '#sites' },
    { label: 'How it was made', href: '/guide/' },
  ],
  hero: {
    kicker: 'An autonomous design experiment',
    headingHtml: 'Twenty-five sites.<br><em>Twenty-five styles.</em><br>One model.',
    subHtml:
      'Every site below — the raymarched gold, the particle constellations, the working synthesizer, the Bauhaus poster machine — was <b>designed, written, tested and deployed autonomously by Claude Fable 5</b>. No templates, no stock assets, no image files: every visual is code.',
    primary: { label: 'Explore the collection', href: '#sites' },
    secondary: { label: 'Read the guide', href: '/guide/' },
    note: '3 iteration passes per site · single-file builds · zero images',
  },
  gridId: 'sites',
  items: templates.map((t) => ({
    no: t.no,
    name: t.name,
    summary: t.summary,
    tag: t.technique,
    swatch: t.swatch,
    href: demoPath(t),
  })),
  about: {
    headingHtml: 'The brief was simple: <em>show what you’re capable of.</em>',
    bodyHtml:
      'Each site is one self-contained HTML file with its own palette, typography and signature technique — WebGL shaders, canvas simulations, generative SVG, variable fonts, Web Audio. Nothing is shared between them except a back-link and an ambition. The full build process, including the mistakes, is documented in <b><a class="inline" href="/guide/">the guide</a></b>.',
  },
  footer: {
    brandNoteHtml: 'Built July 2026 · Hosted on Netlify<br>All brands are fictional; all code is real.',
    creditHtml:
      'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a> (Anthropic)<br>Commissioned by a human who said “go nuts.”',
  },
};
