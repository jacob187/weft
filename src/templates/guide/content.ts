/** Fields ending in `Html` are trusted, author-written HTML (inline <b>/<em>/<code>/<a>/<br> only). */
export interface Link {
  label: string;
  href: string;
}

/** One block of article body, rendered in order inside a section. */
export type Block =
  /** Body paragraph. */
  | { type: 'paragraph'; textHtml: string }
  /** Gold-ruled aside. */
  | { type: 'callout'; textHtml: string }
  /** Bulleted (default) or numbered list. */
  | { type: 'list'; ordered?: boolean; itemsHtml: string[] }
  /** Preformatted block; keep line breaks, wrap highlights in `<b>`. */
  | { type: 'code'; codeHtml: string }
  /** Two-or-more column table; the first column is set in gold monospace. */
  | { type: 'table'; head: string[]; rowsHtml: string[][] };

export interface Section {
  /** Mono eyebrow above the heading, e.g. "01 · THE BRIEF". */
  num: string;
  title: string;
  blocks: Block[];
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Wordmark in the nav; links to `wordmarkHref`. */
  wordmarkHtml: string;
  wordmarkHref: string;
  /** Link on the right of the nav. */
  back: Link;
  hero: {
    kicker: string;
    headingHtml: string;
    ledeHtml: string;
  };
  sections: Section[];
  /** Closing call-to-action card. */
  cta: { title: string; body: string; button: Link };
  footerHtml: string;
}

export const demo: Content = {
  seo: {
    title: 'The Guide — How Weft Works',
    description:
      'How Weft turns 25 code-only website designs into reusable templates and a Claude Code plugin: the template contract, design tokens, the two plugin modes, and lessons from the rebuild.',
    ogTitle: 'How Weft Works',
    ogDescription: 'Templates, tokens, the Claude Code plugin, and lessons from the rebuild.',
  },
  wordmarkHtml: '<em>Weft</em>',
  wordmarkHref: '/',
  back: { label: '← Back to the 25', href: '/' },
  hero: {
    kicker: 'The Guide',
    headingHtml: 'How Weft works —<br><em>and how to make it yours.</em>',
    ledeHtml: `Weft is a library of 25 single-page website designs, rebuilt as <b>reusable templates</b> from the original showcase by <a href="https://github.com/BrainwavePro">BrainwavePro</a>. Every visual is code. Every word is content you can replace. This page explains how the pieces fit, so you can turn any style into your own site.`,
  },
  sections: [
    {
      num: '01 · THE IDEA',
      title: 'A style is a template, not a screenshot',
      blocks: [
        {
          type: 'paragraph',
          textHtml: `Each of the 25 designs started as one self-contained HTML file. Weft splits every one into the same parts: <b>content</b> (copy, brands, lists, links), <b>tokens</b> (colors and font stacks), <b>styles</b>, <b>markup</b> and a <b>signature effect</b>. The original demo brand becomes the default content, so each route still looks exactly like the original, and a new site is just different content plus a few token overrides.`,
        },
        {
          type: 'callout',
          textHtml: `<b>Rule of thumb:</b> if a change is specific to one site, it belongs in content or tokens. If it is a new capability, it becomes an optional field on the template, with the old behavior as the default.`,
        },
      ],
    },
    {
      num: '02 · THE CONTRACT',
      title: 'Six files per template',
      blocks: [
        {
          type: 'table',
          head: ['File', 'Role'],
          rowsHtml: [
            ['meta.ts', 'Gallery card, tags, fonts URL, favicon. Never imports CSS, because the hub globs it.'],
            ['content.ts', 'A JSDoc’d <code>Content</code> interface plus the <code>demo</code> object. Every visible string lives here.'],
            ['theme.css', 'Design tokens on <code>:root</code>. The only file with raw colors.'],
            ['style.css', 'Layout and components, using <code>var(--token)</code> only; alpha via <code>color-mix()</code>.'],
            ['Template.astro', 'Markup. Renders the shared <code>Page</code> shell and mounts the effects.'],
            ['*.ts effects', 'Shaders, particles, audio. They read colors from tokens at init and never hardcode a palette.'],
          ],
        },
      ],
    },
    {
      num: '03 · THE TOKENS',
      title: 'Recolor a shader with one line',
      blocks: [
        {
          type: 'paragraph',
          textHtml: `Canvas and WebGL can’t see CSS variables, so effects call <code>tokenVec3('--gold')</code> or <code>tokenRgba('--accent', .4)</code> when they start. Override a token and the CSS, the SVG and the shader all change together:`,
        },
        {
          type: 'code',
          codeHtml: `<b>// src/sites/acme/site.ts</b>
export const theme: ThemeOverrides = {
  '--gold': '#7cc4ff',        // raymarched metal turns ice-blue
  '--ink':  '#05070d',
};`,
        },
      ],
    },
    {
      num: '04 · MAKE A SITE',
      title: 'Pick a style, write the content',
      blocks: [
        {
          type: 'code',
          codeHtml: `<b>npm run new-site</b> -- obsidian acme-watches
<b>→</b> src/sites/acme-watches/site.ts        content · theme · seo
<b>→</b> src/pages/sites/acme-watches/          route at /sites/acme-watches/`,
        },
        {
          type: 'paragraph',
          textHtml: `<code>site.ts</code> starts as a copy of the demo. TypeScript flags any field you miss, and the JSDoc on <code>Content</code> explains what each one does.`,
        },
      ],
    },
    {
      num: '05 · THE PLUGIN',
      title: 'Weft inside Claude Code',
      blocks: [
        {
          type: 'paragraph',
          textHtml: `The repository is also a Claude Code plugin. Describe the site you want, and the <code>weft</code> skill suggests three matching styles, then works in one of two modes:`,
        },
        {
          type: 'list',
          itemsHtml: [
            `<b>Template mode:</b> scaffolds a complete standalone Astro site and fills the content model with your real copy.`,
            `<b>Style mode:</b> drops <code>tokens.css</code>, the fonts and the framework-agnostic effects into an existing project, then maps them onto your components.`,
          ],
        },
        {
          type: 'code',
          codeHtml: `<b>/plugin marketplace add</b> &lt;owner&gt;/weft
<b>/plugin install</b> weft@weft`,
        },
      ],
    },
    {
      num: '06 · THE TECHNIQUES',
      title: 'What powers each style',
      blocks: [
        {
          type: 'table',
          head: ['Style', 'Signature technique'],
          rowsHtml: [
            ['01 Obsidian', 'Raymarched SDF metaballs (raw GLSL), smooth-min blending, fresnel gold shading'],
            ['02 Botanica', 'Seeded SVG vine, <code>stroke-dashoffset</code> driven by scroll; leaves spring in at thresholds'],
            ['03 Monolith', 'Variable font axes (<code>wdth</code>/<code>wght</code>) bound to cursor; scramble-text hover'],
            ['04 Aurora', 'FBM value-noise curtains in a fragment shader; procedural stars; SVG gauge'],
            ['05 Neon District', 'Canvas perspective grid + starfield; CRT scanlines; box-shadow pixel sprites'],
            ['06 Kaze', 'Enso stroke animation; canvas karesansui with lines deflecting around stones'],
            ['07 Meridian', 'Exposed 12-column grid; duotone SVG illustration; collapsing masthead'],
            ['08 Stellar', '1,900-particle system with spring-to-target morphing between text and shapes'],
            ['09 Prism', 'Glassmorphism (<code>backdrop-filter</code>), animated gradient mesh, live-drifting SVG chart'],
            ['10 Nullsector', 'Working terminal emulator: command registry, history, staged async output'],
            ['11 Rosewood', 'Generative Art Deco sunburst; elevator-dial scroll indicator'],
            ['12 Helix', 'Three.js: parametric helix tube, PBR + RoomEnvironment, scroll camera, live material configurator'],
            ['13 Doughbox', 'Canvas metaball goo; spring-physics hovers; live oven schedule from the clock'],
            ['14 Riot Fest', 'Per-letter kinetic type with overshoot entrances; opposing marquees'],
            ['15 Atelier Noir', 'Parametric architecture drawings that draw themselves via <code>getTotalLength()</code>'],
            ['16 Abyssal', 'Scroll-as-descent: depth meter, background gradient shift, animated SVG fauna'],
            ['17 Papercut', 'Generated jagged <code>clip-path</code> polygons for every torn edge; riso 2-color art'],
            ['18 Flux', 'Hand-rolled climate graphics: warming stripes, polar spiral, Keeling curve'],
            ['19 Mirage', 'Pure-CSS 3D: slat-masked sun, perspective-transformed animated grid floor'],
            ['20 Tempo', 'Web Audio: polyphonic osc→filter→delay graph with a live AnalyserNode oscilloscope'],
            ['21 Formwerk', 'Seeded PRNG composing posters from 4 archetypes; SVG download'],
            ['22 Nimbus', 'FBM cloud shader with lerped mood palettes; lightning uniform; canvas rain'],
            ['23 Codex', 'Generative illuminated borders; animated gold-leaf gradient text'],
            ['24 Errata', 'Draggable window manager in ~40 lines; spawning easter egg; cursor trail'],
            ['25 Verité', 'Live film grain + scratches on canvas; letterbox chrome; CSS credit roll'],
          ],
        },
      ],
    },
    {
      num: '07 · LESSONS',
      title: 'What the rebuild taught us',
      blocks: [
        {
          type: 'table',
          head: ['Bug', 'Lesson'],
          rowsHtml: [
            [
              'fallback word',
              `Particles that trace text drawn on a canvas sample whichever font is loaded <b>at that moment</b>. Wait for <code>document.fonts.load()</code> and re-sample, or the word comes out in the fallback face.`,
            ],
            [
              'CSS bleed',
              `In Astro, glob-importing every <code>Template.astro</code> bundles every template’s global CSS into every page. The hub globs only <code>meta.ts</code>; each template gets its own route file.`,
            ],
            [
              'tokens in canvas',
              `CSS variables never reach WebGL on their own. Effects read tokens once at init. Live theme switching would need a re-init hook.`,
            ],
            [
              'virtual time',
              `Headless Chrome’s <code>--virtual-time-budget</code> pauses while network requests are pending, so animated pages can get far fewer frames than you expect. Compare animations in real time.`,
            ],
          ],
        },
      ],
    },
    {
      num: '08 · ADD A STYLE',
      title: 'Grow the library',
      blocks: [
        {
          type: 'list',
          ordered: true,
          itemsHtml: [
            `Create <code>src/templates/&lt;slug&gt;/</code> following the six-file contract.`,
            `Add <code>tags</code> and <code>bestFor</code> to <code>meta.ts</code>; the plugin uses them to match briefs to styles.`,
            `Add a route at <code>src/pages/NN-&lt;slug&gt;/index.astro</code>. It appears in the hub automatically.`,
            `Run <code>npm run build:skill</code> to regenerate the plugin’s style references.`,
          ],
        },
      ],
    },
  ],
  cta: {
    title: 'Now pick a style.',
    body: 'Twenty-five designs, zero images, every one ready to become your site.',
    button: { label: 'Browse the collection →', href: '/' },
  },
  footerHtml:
    'Weft · MIT licensed · Original designs by <a href="https://github.com/BrainwavePro">BrainwavePro</a><br>All brands fictional, all code real',
};
