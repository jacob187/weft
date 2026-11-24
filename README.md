# weft

A library of 25 distinct single-page website templates (plus a gallery hub and a long-form article
template), rebuilt from the [Fable Showcase](https://fable-showcase-25.netlify.app/). Every visual is
code: WebGL shaders, canvas simulations, generative SVG, variable fonts, Web Audio. No image files.

## Quick start
```sh
nvm use            # Node 24
npm install
npm run dev        # http://localhost:4321 — the hub lists every template
```

## Build a new site from a template
```sh
npm run new-site -- obsidian acme-watches   # or: npm run new-site -- 01 acme-watches
```
Then edit `src/sites/acme-watches/site.ts`:

```ts
export const content: Content = { ...demo, brand: 'ACME' /* typed: every field documented */ };
export const theme: ThemeOverrides = { '--gold': '#7cc4ff' };   // recolors CSS *and* shaders
export const seo: Partial<Seo> = { title: 'ACME — Watches' };
```
Preview at `/sites/acme-watches/`. To make it the root page, point `src/pages/index.astro` at it.

## How templates work
Each `src/templates/<slug>/` holds `meta.ts` (gallery card), `content.ts` (typed `Content` + `demo`),
`theme.css` (tokens), `style.css`, `Template.astro`, and effect modules. Content and design are
separate, so a site is a content file plus token overrides, never a fork. See `CLAUDE.md` for the
full contract.

## Claude Code plugin (`weft`)
This repo is also a Claude Code plugin and marketplace. The `weft` skill turns any of the
templates into either:

- **Template mode:** a complete standalone Astro site in a new folder, with the content model ready to fill.
- **Style mode:** a style kit for an existing project (React, Next, Vue, plain HTML). It holds
  `tokens.css`, the fonts, and framework-agnostic effect modules, and the skill maps them onto your
  current components.

Install from a local clone:
```
/plugin marketplace add /path/to/weft
/plugin install weft@weft
```
After pushing to GitHub: `/plugin install weft --marketplace <owner>/<repo>`.

Then ask Claude for a site ("a landing page for a natural-wine bar"), name a style ("restyle this
app like aurora"), or run `/weft:weft list`. The skill can also be run directly:

```sh
node skills/weft/scripts/weft.mjs list
node skills/weft/scripts/weft.mjs deal "climate nonprofit annual report"
node skills/weft/scripts/weft.mjs template flux --out ../climate-report --name climate-report
node skills/weft/scripts/weft.mjs style aurora --out ../my-app/src/styles/weft-aurora
```

The skill's style references (`skills/weft/references/`) are generated from `src/templates/`.
Run `npm run build:skill` after changing a template.

## Scripts
| | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | static build to `dist/` |
| `npm run check` | type-check `.astro` + `.ts` |
| `npm run new-site -- <template> <name>` | scaffold a site inside this repo |
| `npm run build:skill` | regenerate the plugin's style references from the templates |
