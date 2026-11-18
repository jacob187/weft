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
    title: 'The Guide — How the Fable Showcase Was Built',
    description:
      'How 25 fundamentally different websites were designed, built, tested and deployed autonomously by Claude Fable 5 — the workflow, the techniques, the bugs, and how to do it yourself.',
    ogTitle: 'How the Fable Showcase Was Built',
    ogDescription: 'The workflow, the techniques, the bugs, and how to do it yourself.',
  },
  wordmarkHtml: 'The <em>Fable</em> Showcase',
  wordmarkHref: '/',
  back: { label: '← Back to the 25', href: '/' },
  hero: {
    kicker: 'The Guide',
    headingHtml: 'How this was built —<br><em>and how you can do it too.</em>',
    ledeHtml: `Everything in this showcase — 25 sites, this hub, and the page you're reading — was designed, coded, reviewed and deployed <b>autonomously by Claude Fable 5</b> running in Claude Code, from a single prompt. One human wrote the brief and came back later. This page documents the exact workflow so you can reproduce it.`,
  },
  sections: [
    {
      num: '01 · THE BRIEF',
      title: 'Start with taste, not tasks',
      blocks: [
        {
          type: 'paragraph',
          textHtml: `The prompt didn't specify pages, sections or color schemes. It set a <b>quality bar</b> ("extreme capabilities in web design, taste, and artistic flavor"), demanded <b>fundamental variety</b> (every site must differ in technique, not just palette), and mandated a <b>review discipline</b>: at least three fine-toothed iteration passes per site before calling it done. Constraints breed style; vagueness breeds templates.`,
        },
        {
          type: 'callout',
          textHtml: `<b>Reusable prompt skeleton:</b> "Build N sites that are fundamentally different from each other. For each: a distinct signature technique, palette, and typographic voice. After building each one, make three review passes — composition, complexity, polish — before moving on. Deploy everything and document the process at /guide."`,
        },
      ],
    },
    {
      num: '02 · THE PLAN',
      title: 'Design the collection before the sites',
      blocks: [
        {
          type: 'paragraph',
          textHtml: `Before writing any HTML, the full roster was planned in a table: number, name, concept, signature technique, palette, and type pairing for all 25. That plan lived in a <code>PLAN.md</code> file the model kept updating — along with a <code>PROGRESS.md</code> status tracker, which is what let the build survive context limits and session restarts without losing its place.`,
        },
        {
          type: 'list',
          itemsHtml: [
            `<b>Spread the techniques deliberately:</b> raymarching, fbm shaders, particle systems, Three.js, Web Audio, variable fonts, generative SVG, CSS-only 3D, canvas simulation, terminal emulation, seeded generators. No two sites share a headline trick.`,
            `<b>Spread the moods too:</b> luxury, botanical, brutalist, cozy, chaotic, medieval, cinematic. Alternate light/dark, serious/playful, dense/airy as you go.`,
            `<b>Fictional brands with real voices.</b> Every site got written copy with a specific personality — a bakery that names its sourdough starter, a security firm with a flag to find. Copy is half the design.`,
          ],
        },
      ],
    },
    {
      num: '03 · THE RULES',
      title: 'Constraints that kept 25 sites coherent',
      blocks: [
        {
          type: 'list',
          itemsHtml: [
            `<b>One self-contained HTML file per site.</b> Inline CSS and JS. No build step, no frameworks, no npm dependencies at runtime (Three.js vendored locally as the one exception).`,
            `<b>Zero image files.</b> Every visual is code: WebGL, canvas, SVG, gradients, CSS filters. This forces genuine design skill instead of stock-photo styling.`,
            `<b>A shared skeleton, restyled every time:</b> fixed nav that condenses on scroll, IntersectionObserver reveals, a consistent back-to-hub chip, <code>prefers-reduced-motion</code> respect, meta/OG tags, an inline SVG favicon in each site's palette.`,
            `<b>Fonts from Google Fonts, everything else local.</b> 21 distinct type pairings across the collection.`,
          ],
        },
      ],
    },
    {
      num: '04 · THE LOOP',
      title: 'Build → screenshot → critique → fix ×3',
      blocks: [
        {
          type: 'paragraph',
          textHtml: 'The core workflow, per site. This is where the quality actually comes from:',
        },
        {
          type: 'code',
          codeHtml: `<b>1.</b> Write the complete v1 (all sections, motion, responsive, ~600–900 lines).
<b>2.</b> Serve locally:            npx serve site -l 5757
<b>3.</b> Screenshot it headlessly:  Playwright → full-page sweep,
                               desktop (1280×800) + mobile (375×812)
<b>4.</b> READ the screenshots and critique like a reviewer:
   composition, overlap, contrast, spacing rhythm, dead zones
<b>5.</b> Fix. Re-shoot. Repeat — minimum three passes.
<b>6.</b> Test interactions in the same headless browser:
   click buttons, type in terminals, press synth keys, drag windows.
   Assert on real outcomes (a note plays, a window spawns).`,
        },
        {
          type: 'paragraph',
          textHtml: `The screenshot step is non-negotiable. Nearly every real bug was caught by <b>looking at pixels</b>, not by re-reading code.`,
        },
      ],
    },
    {
      num: '05 · THE BUGS',
      title: 'Mistakes worth knowing about in advance',
      blocks: [
        {
          type: 'table',
          head: ['Bug', 'Lesson'],
          rowsHtml: [
            [
              'canvas 704px wide',
              `An absolutely-positioned <code>&lt;canvas&gt;</code> with only <code>left:0;right:0</code> keeps its <b>intrinsic size</b>. Always set explicit <code>width:100%;height:100%</code>. This bit twice (a grid floor and a full-screen 3D stage).`,
            ],
            [
              'fonts 400',
              `Google Fonts variable-axis URLs fail silently as "400: Invalid selector" if a range is wrong (Anybody's width axis is 50..150, not 10..400) — and then <b>every font in the URL falls back</b>. Curl-verify the CSS URL before trusting it.`,
            ],
            [
              'frozen compositor',
              `A full-viewport <code>mix-blend-mode</code> overlay froze screenshot capture entirely. Use pre-tinted low-opacity textures instead of blend modes over the whole page.`,
            ],
            [
              'portrait shaders',
              `A shader composition that's perfect at 16:9 puts the hero blob behind your headline at 9:19. Pass the aspect ratio in and <b>art-direct portrait separately</b>.`,
            ],
            [
              'inline spans',
              `Width and height silently do nothing on inline elements — color swatch dots need <code>display:block</code>.`,
            ],
          ],
        },
      ],
    },
    {
      num: '06 · THE TECHNIQUES',
      title: 'What powers each site',
      blocks: [
        {
          type: 'table',
          head: ['Site', 'Signature technique'],
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
      num: '07 · THE SHIP',
      title: 'Deploying',
      blocks: [
        {
          type: 'paragraph',
          textHtml: `The whole collection is one static folder — hub at the root, each site in a numbered subdirectory, this guide at <code>/guide/</code>. Netlify serves it with zero configuration beyond a publish directory:`,
        },
        {
          type: 'code',
          codeHtml: `<b>netlify sites:create</b> --name your-showcase
<b>netlify deploy</b> --prod --dir site`,
        },
        {
          type: 'paragraph',
          textHtml: `Deploy early with a placeholder to de-risk the pipeline, then keep shipping batches — by the time the last site was finished, the first seventeen had already been live for hours.`,
        },
      ],
    },
    {
      num: '08 · DO IT YOURSELF',
      title: 'The short version',
      blocks: [
        {
          type: 'list',
          ordered: true,
          itemsHtml: [
            `Give a capable model a brief about <b>taste and variety</b>, not features.`,
            `Demand a <b>named signature technique</b> per site — it prevents template convergence.`,
            `Give it <b>eyes</b>: a headless browser it can screenshot and read. This is the single highest-leverage tool in the loop.`,
            `Enforce <b>three critique passes</b> per site, including mobile.`,
            `Keep durable <b>plan and progress files</b> so long runs survive interruptions.`,
            `Let it deploy, then get out of the way.`,
          ],
        },
      ],
    },
  ],
  cta: {
    title: 'Now go look at what the process produced.',
    body: 'Twenty-five sites, three passes each, zero images, one very patient model.',
    button: { label: 'Browse the showcase →', href: '/' },
  },
  footerHtml:
    'Designed, built &amp; written autonomously by Claude Fable 5 (Anthropic) · July 2026<br>Hosted on Netlify · All brands fictional, all code real',
};
