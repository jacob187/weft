---
name: weft
description: Build or restyle websites from 25 hand-built, code-only design styles (raymarched gold, particle morphs, Bauhaus generators, synthwave grids, editorial grids, Web Audio, film grain…). Use when the user wants a new landing page or site with a distinctive look, wants an existing frontend restyled in one of these styles, names a style from the library (obsidian, aurora, riot, codex…), or says "weft". Two modes — template (scaffold a complete Astro site) and style (a token + effect kit applied to an existing project).
argument-hint: "[<brief>] | template <style> [dir] | style <style> [path] | list"
---

# weft — website styles & templates

25 complete, single-page website designs (plus `gallery` and `guide` layout templates). Each one is a **style**: design tokens (`theme.css`),
type pairing, component treatments, and a signature effect written in code (WebGL, canvas, SVG,
Web Audio). No image files anywhere. Every style also ships as a working Astro template with a
typed content model, so a new site is "pick a style, write the content".

Paths below are relative to this skill's base directory (`<skill-dir>`). The plugin root — which
contains the template source in `src/templates/<slug>/` — is `<skill-dir>/../..`.

## Pick the mode

| The user wants… | Mode |
|---|---|
| a new site / landing page / microsite, or names `template` | **template** |
| an existing app or page to look like a style, or names `style` | **style** |
| to browse, or says `list` | run `list`, show it, stop |

If it is genuinely unclear whether they want a new project or a restyle, ask once. Otherwise decide.

## Pick the style

1. A style named by the user wins (slug, number, or display name).
2. Otherwise run `node <skill-dir>/scripts/weft.mjs deal "<their brief, brand, audience, mood>"`
   and present the top 3 as one line each (name — what it looks like — why it fits). Let the user
   choose. If they said "you pick", choose the best fit and say why in one sentence.
3. Read **only** that style's reference: `<skill-dir>/references/styles/<slug>.md` (tokens, fonts,
   effects, full content model). For exact component CSS and markup, read
   `src/templates/<slug>/style.css` and `Template.astro` from the plugin root.

`node <skill-dir>/scripts/weft.mjs list` prints the whole catalog (number, slug, technique, summary).

## Template mode — a complete new site

1. Choose the output directory (user's choice, else `./<brand-or-style>-site`). It must be new or empty.
2. `node <skill-dir>/scripts/weft.mjs template <style> --out <dir> --name <kebab-name>`
   This writes a standalone Astro 7 project: the template, shared helpers, `src/site.ts`, `CLAUDE.md`.
3. Write the site in `src/site.ts`:
   - Replace **every** demo field with the user's real content (brand, nav, headings, sections,
     prices, contact, SEO). Keep arrays the length the content actually needs. No lorem ipsum and no
     invented metrics, testimonials or prices: ask for facts you don't have, or leave a clear `TODO:`.
   - Brand colors → `theme` overrides of the existing tokens (keep contrast; dark styles need light
     text tokens to stay light). Changing fonts → override the font-stack tokens in `theme` and
     update `fontsHref` in the copied `src/templates/<slug>/meta.ts` so the new families load.
   - Don't edit `Template.astro`/`style.css` for content. If the site needs a section or knob the
     style lacks, add an **optional** `Content` field whose default keeps the original behavior.
4. `npm install && npm run build && npm run check` in `<dir>` (Node ≥ 22.23 — see `.nvmrc`). Fix
   all errors. Offer `npm run dev` for a preview.

## Style mode — restyle an existing project

1. Read the project first: framework, where global CSS lives, how fonts load, the main layout and
   the components that define the look (buttons, cards, nav, headings). Note its color/font usage.
2. `node <skill-dir>/scripts/weft.mjs style <style> --out <project>/<styles-dir>/<slug>` (pick a
   location that matches the project's conventions, e.g. `src/styles/weft-<slug>`). It writes
   `tokens.css`, `fonts.html`, `effects/` (TypeScript, framework-agnostic) and `reference/`.
3. Apply it:
   - Import `tokens.css` globally; load the fonts the project's way (`next/font`, `<link>`, etc.).
   - Replace hardcoded colors and font families with `var(--token)`; derive alpha variants with
     `color-mix(in srgb, var(--token) N%, transparent)`. If the project already has a token layer
     (Tailwind theme, CSS variables, design tokens), map the style's tokens onto it instead of
     adding a parallel system.
   - Port type scale, spacing, borders, radii, shadows, motion and button/card/nav treatments from
     `reference/style.css` onto the **existing** markup. Keep the project's structure, content,
     routing and accessibility unless the user asked for a layout change.
   - Mount the signature effect where it belongs (usually the hero): call its `init…(el)` client-side
     after mount (React: `useEffect` + ref; clean up on unmount if the effect returns a cleanup).
     Effects using `three` need `npm i three`.
   - JS/TS only: if the project isn't TypeScript, the effects are plain enough to rename to `.js`
     after stripping type annotations.
4. Build/lint/test the project with its own commands. Report what changed, file by file.

## Rules that keep the styles intact

- Tokens are the only source of color and font stacks. Canvas/WebGL effects read them at init, so
  recoloring happens through tokens, never by editing effect code.
- Keep effect math, timing and numeric constants as they are; they are tuned.
- Respect `prefers-reduced-motion` the way each effect already does.
- No image files; visuals are code. Don't add stock imagery to "complete" a style.
- Fonts come from Google Fonts URLs in the reference; keep the pairing unless the user changes it.
- Fields ending in `Html` take trusted inline HTML only (`<em> <b> <i> <br> <a> <span>`); never
  route user-submitted or external data into them.
