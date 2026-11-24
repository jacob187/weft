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
    title: 'Weft — 25 Website Styles, Woven From Code',
    description:
      'Twenty-five code-only website templates — raymarched gold, particle constellations, working synthesizers, Bauhaus machines — ready to become your site, plus a Claude Code plugin that applies them.',
    ogTitle: 'Weft — 25 Website Styles, Woven From Code',
    ogDescription: 'Twenty-five code-only website templates and a Claude Code plugin that applies them.',
  },
  wordmarkHtml: '<em>Weft</em>',
  nav: [
    { label: 'The 25', href: '#sites' },
    { label: 'How it works', href: '/guide/' },
  ],
  hero: {
    kicker: 'A library of code-only website styles',
    headingHtml: 'Twenty-five sites.<br><em>Twenty-five styles.</em><br>Zero images.',
    subHtml:
      'Every site below — the raymarched gold, the particle constellations, the working synthesizer, the Bauhaus poster machine — is a <b>reusable template</b>. Swap the content, override a few tokens, and it becomes yours. No stock assets, no image files: every visual is code.',
    primary: { label: 'Explore the collection', href: '#sites' },
    secondary: { label: 'Read the guide', href: '/guide/' },
    note: 'astro templates · design tokens · claude code plugin',
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
    headingHtml: 'Each style is a template: <em>change the words, keep the craft.</em>',
    bodyHtml:
      'Every template has its own palette, typography and signature technique — WebGL shaders, canvas simulations, generative SVG, variable fonts, Web Audio — with content and design kept apart. Use one as a full site, or pour its style into the app you already have with the Weft plugin for Claude Code. Original designs by <b><a class="inline" href="https://github.com/BrainwavePro">BrainwavePro</a></b>; how it all fits together is in <b><a class="inline" href="/guide/">the guide</a></b>.',
  },
  footer: {
    brandNoteHtml: 'MIT licensed · Built with Astro<br>All brands are fictional; all code is real.',
    creditHtml:
      'Original designs by <a href="https://github.com/BrainwavePro">BrainwavePro</a><br>Rebuilt as reusable templates · <a href="/guide/">How it works</a>',
  },
};
