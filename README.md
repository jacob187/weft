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

## Scripts
| | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | static build to `dist/` |
| `npm run check` | type-check `.astro` + `.ts` |
| `npm run new-site -- <template> <name>` | scaffold a site |
