# weft — website template library

A library of 25 single-page website designs (plus a hub and a guide), rebuilt as **reusable templates** from the original showcase by BrainwavePro (https://github.com/BrainwavePro).
Each design is a template you build new websites from: the original demo brand is just its default
content. Astro 7 static output, no UI framework, no image files (every visual is code).

## Commands
- Node 24 (`.nvmrc`). Astro 7 needs Node ≥ 22.23.4. If `node -v` is older:
  `export PATH="$HOME/.nvm/versions/node/v24.21.0/bin:$PATH"`.
- `npm run dev` · `npm run build` · `npm run check` (types) ·
  `npm run new-site -- <template> <site-name>`.

## Layout
```
src/
  layouts/Page.astro          <html>/<head> shell: SEO, favicon, Google Fonts, theme overrides
  lib/                        shared client helpers: tokens.ts, motion.ts, canvas.ts
  templates/
    types.ts                  TemplateMeta, TemplateProps<C>, ThemeOverrides, Seo
    registry.ts               globs */meta.ts → gallery cards (never glob Template.astro)
    <slug>/                   one folder per template (see contract)
  pages/
    index.astro               hub = gallery template + registry items
    guide/index.astro         guide = guide template
    NN-<slug>/index.astro     demo route per template: <Template content={demo} showcase />
    sites/<name>/index.astro  derived sites (scaffolded by new-site)
  sites/<name>/site.ts        derived site content + theme + seo
```

## Template contract (`src/templates/<slug>/`)
| File | Rule |
|---|---|
| `meta.ts` | default-export `TemplateMeta`. No CSS imports (it is globbed by the registry). |
| `content.ts` | `export interface Content` (JSDoc every field) + `export const demo: Content` reproducing the original copy exactly. All user-visible text, brand names, nav, lists, prices, links, SEO title/description live here. |
| `theme.css` | `:root` tokens only: every color and font stack. The only file with raw palette values. |
| `style.css` | Layout/components using `var(--token)`. Alpha variants via `color-mix(in srgb, var(--x) N%, transparent)`, not hardcoded rgba of palette colors. Neutral black/white shadows may stay literal. |
| `Template.astro` | `type Props = TemplateProps<Content>`; renders `<Page>`; imports `./theme.css`, `./style.css`; one processed `<script>` that imports the effect modules. Showcase chrome (hub chip, "Part of Weft" line) only when `showcase` is true. |
| `*.ts` effects | Export `init`-style functions taking elements. Read colors with `token()/tokenVec3()/tokenRgba()` from `~/lib/tokens` at init — never hardcode palette. Text drawn to canvas comes from content via `data-*` attributes. Use `~/lib/motion` and `~/lib/canvas` instead of re-writing reveal/raf/resize code. |

- Fields named `*Html` are trusted author HTML rendered with `set:html` (inline `<em> <b> <i> <br> <a> <span>` only). Everything else renders as text.
- Respect `prefers-reduced-motion` the way the original did.
- `three` is an npm dependency (`import * as THREE from 'three'`, addons via `three/examples/jsm/...`).
- Fidelity bar: the demo route must look and behave like the original page — same copy, fonts,
  palette, layout at desktop and 375px, animations and interactions.

## Claude Code plugin
The repo root is the `weft` plugin (`.claude-plugin/plugin.json`) and its own marketplace
(`.claude-plugin/marketplace.json`, plugin `source: "./"`). The plugin itself is `skills/weft/`:
- `SKILL.md`: trigger conditions, mode choice, and the template/style workflows.
- `scripts/weft.mjs`: `list | deal | template | style`. Zero deps, Node ≥ 18. It reads
  `references/index.json`, copies from `src/`, and never writes into a non-empty dir.
- `references/`: **generated** by `npm run build:skill` from `meta.ts`, `theme.css`, `content.ts`
  and effect JSDoc. Never hand-edit it; rerun after any template change and commit the output.
- Template-mode output pins dependency versions from this `package.json`. Style-mode output rewrites
  `~/lib/*` and `~/templates/types` imports to relative paths.
- `meta.ts` `tags`/`bestFor` drive `deal`. Keep them accurate when adding a template.
- Check with `claude plugin validate .`.

## Making a new site
`npm run new-site -- obsidian acme-watches` → edit `src/sites/acme-watches/site.ts` (content, theme
tokens, seo). Never edit template code for one site's needs; if a site needs a new knob, add an
optional field to the template's `Content` with the old behavior as default.

## Adding a template
New folder following the contract + `src/pages/NN-<slug>/index.astro` + `tags`/`bestFor` in `meta.ts`,
then `npm run build:skill`. It appears in the hub and the plugin automatically.

## Reference
Original pages were captured to the session scratchpad during the rebuild; they are not in the repo.
Live original: https://fable-showcase-25.netlify.app/ (`/NN-slug/`, `/guide/`).
