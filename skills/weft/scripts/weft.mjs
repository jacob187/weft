#!/usr/bin/env node
/**
 * weft — website styles & templates (Node ≥ 18, no dependencies).
 *
 *   weft.mjs list [--json]                         every style, one line each
 *   weft.mjs deal "<brief>" [--n 3] [--json]       best-matching styles for a brief
 *   weft.mjs template <style> --out <dir>          standalone Astro site built on a style
 *   weft.mjs style <style> --out <dir>             framework-agnostic style kit for an existing project
 *
 * <style> is a slug ("obsidian"), a number ("01"/"1") or both ("01-obsidian").
 * The plugin root (this repo) is resolved relative to this file.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(skillDir, '../..');
const templatesDir = join(root, 'src/templates');
const index = JSON.parse(readFileSync(join(skillDir, 'references/index.json'), 'utf8'));

function fail(msg) {
  console.error(`weft: ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const pos = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) flags[key] = true;
      else flags[key] = argv[++i];
    } else pos.push(a);
  }
  return { pos, flags };
}

function findStyle(raw) {
  if (!raw) fail('missing <style>. Run `weft.mjs list`.');
  const key = String(raw).trim().toLowerCase();
  const num = /^\d{1,2}$/.test(key) ? key.padStart(2, '0') : null;
  const s = index.find((t) => t.slug === key || (t.no && (t.no === num || `${t.no}-${t.slug}` === key)));
  if (!s) fail(`unknown style "${raw}". Run \`weft.mjs list\`.`);
  return s;
}

/** Target dir must be new or empty; never overwrite a user's files. */
function prepareOut(raw) {
  if (!raw || raw === true) fail('missing --out <dir>');
  const out = resolve(process.cwd(), raw);
  if (existsSync(out)) {
    if (!statSync(out).isDirectory()) fail(`--out exists and is not a directory: ${out}`);
    if (readdirSync(out).length) fail(`--out is not empty: ${out}`);
  }
  mkdirSync(out, { recursive: true });
  return out;
}

const line = (s) =>
  `${(s.no || '--').padEnd(2)}  ${s.slug.padEnd(9)}  ${s.technique.padEnd(17)}  ${s.summary}`;

// ---------- list / deal ----------

function list(flags) {
  if (flags.json) return console.log(JSON.stringify(index, null, 2));
  index.forEach((s) => console.log(line(s)));
}

const STOP = new Set(
  'a an and are as at be but by for from has have i in is it its me my of on or our site that the their this to us want we website with you your page'.split(' '),
);

/** Score = weighted word overlap between the brief and each style's tags / best-for / summary / name. */
function deal(brief, flags) {
  if (!brief) fail('usage: weft.mjs deal "<brief>" [--n 3]');
  const n = Math.max(1, Math.min(10, Number(flags.n) || 3));
  const words = new Set((brief.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => w.length > 1 && !STOP.has(w)));
  const hits = (text, w) =>
    (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).reduce((acc, t) => acc + (words.has(t) ? w : 0), 0);
  const ranked = index
    .map((s) => ({
      s,
      score:
        s.tags.reduce((a, t) => a + hits(t, 3), 0) +
        s.bestFor.reduce((a, t) => a + hits(t, 2), 0) +
        hits(s.summary, 1) +
        hits(s.name, 3),
    }))
    .sort((a, b) => b.score - a.score || (a.s.no || '99').localeCompare(b.s.no || '99'));
  const matched = ranked.filter((r) => r.score > 0);
  const top = (matched.length ? matched : ranked).slice(0, n);
  if (flags.json) return console.log(JSON.stringify(top.map((r) => ({ ...r.s, score: r.score })), null, 2));
  if (!top[0].score) console.log('(no keyword match — showing the first styles; pick by feel from `list`)');
  top.forEach(({ s, score }) =>
    console.log(`${line(s)}\n      best for: ${s.bestFor.join('; ')}  ·  score ${score}\n`),
  );
}

// ---------- shared copy helpers ----------

const rootPkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const dep = (name) => rootPkg.dependencies?.[name] ?? rootPkg.devDependencies?.[name];

function copy(rel, out, destRel = rel) {
  const from = join(root, rel);
  if (!existsSync(from)) fail(`plugin is missing ${rel}`);
  cpSync(from, join(out, destRel), { recursive: true });
}

/** Rewrite `~/` alias imports in copied effect modules to relative paths for the style kit. */
function rewriteAliases(src) {
  return src
    .replace(/from '~\/lib\/(\w+)'/g, "from './lib/$1'")
    .replace(/from '~\/templates\/types'/g, "from './types'");
}

// ---------- template mode ----------

function template(style, out, flags) {
  const name = (flags.name && flags.name !== true ? flags.name : `${style.slug}-site`).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 60) fail(`--name must be kebab-case: "${flags.name}"`);

  for (const f of ['astro.config.mjs', 'tsconfig.json', '.nvmrc', 'src/layouts/Page.astro', 'src/lib', 'src/templates/types.ts'])
    copy(f, out);
  copy(`src/templates/${style.slug}`, out);
  if (style.slug === 'gallery') copy('src/templates/registry.ts', out);
  writeFileSync(join(out, '.gitignore'), 'node_modules\ndist/\n.astro/\n.DS_Store\n.env\n.env.*\n');

  const deps = { astro: dep('astro') };
  const devDeps = { '@astrojs/check': dep('@astrojs/check'), typescript: dep('typescript') };
  if (style.three) {
    deps.three = dep('three');
    devDeps['@types/three'] = dep('@types/three');
  }
  writeFileSync(
    join(out, 'package.json'),
    JSON.stringify(
      {
        name,
        private: true,
        type: 'module',
        version: '0.1.0',
        engines: rootPkg.engines,
        scripts: { dev: 'astro dev', build: 'astro build', preview: 'astro preview', check: 'astro check' },
        dependencies: deps,
        devDependencies: devDeps,
      },
      null,
      2,
    ) + '\n',
  );

  writeFileSync(
    join(out, 'src/site.ts'),
    `import type { Seo, ThemeOverrides } from '~/templates/types';
import { demo, type Content } from '~/templates/${style.slug}/content';

/**
 * Everything specific to this site. Replace the demo copy field by field —
 * the Content type (see src/templates/${style.slug}/content.ts) documents every field.
 */
export const content: Content = {
  ...demo,
};

/** Token overrides, e.g. { '--accent': '#ff5500' }. Token list: src/templates/${style.slug}/theme.css */
export const theme: ThemeOverrides = {};

/** <head> overrides: title, description, favicon, themeColor... */
export const seo: Partial<Seo> = {};
`,
  );
  mkdirSync(join(out, 'src/pages'), { recursive: true });
  writeFileSync(
    join(out, 'src/pages/index.astro'),
    `---
import Template from '~/templates/${style.slug}/Template.astro';
import { content, theme, seo } from '~/site';
---

<Template content={content} theme={theme} seo={seo} />
`,
  );
  writeFileSync(
    join(out, 'CLAUDE.md'),
    `# ${name}

Astro site built on the **${style.name}** style (${style.technique}) from the weft template library.

- Site-specific content, theme tokens and SEO live in \`src/site.ts\`. Edit there first.
- Design lives in \`src/templates/${style.slug}/\`: \`theme.css\` (tokens — the only raw colors), \`style.css\` (uses tokens only),
  \`Template.astro\`, and effect modules that read colors from tokens at runtime via \`src/lib/tokens.ts\`.
- Fields ending in \`Html\` are trusted author HTML (inline tags only). Everything else renders as text.
- Need a new knob? Add an optional field to \`Content\` with the old behavior as the default.
- \`npm run dev\` · \`npm run build\` · \`npm run check\` (Node ${rootPkg.engines?.node ?? '≥ 22'}).
`,
  );

  console.log(`Created ${name} from "${style.slug}" at ${out}
Next:
  cd ${relative(process.cwd(), out) || '.'} && npm install && npm run dev
  edit src/site.ts (content, theme tokens, seo)`);
}

// ---------- style mode ----------

function styleKit(style, out) {
  const src = join(templatesDir, style.slug);
  const files = readdirSync(src);
  const contentSrc = readFileSync(join(src, 'content.ts'), 'utf8');
  // content.ts is copied when it is self-contained (effects import data/types from it).
  const keepContent = !contentSrc.includes('~/templates/registry');

  mkdirSync(join(out, 'effects/lib'), { recursive: true });
  mkdirSync(join(out, 'reference'), { recursive: true });

  writeFileSync(
    join(out, 'tokens.css'),
    `/* ${style.name} tokens — from the weft template library. Import once, globally. */\n` +
      readFileSync(join(src, 'theme.css'), 'utf8'),
  );

  const meta = readFileSync(join(src, 'meta.ts'), 'utf8');
  const fontsHref = meta.match(/fontsHref:\s*'([^']+)'/)?.[1];
  writeFileSync(
    join(out, 'fonts.html'),
    fontsHref
      ? `<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n<link href="${fontsHref}" rel="stylesheet" />\n`
      : '<!-- system fonts: nothing to load -->\n',
  );

  const effects = [];
  for (const f of files) {
    if (!f.endsWith('.ts') || f === 'meta.ts' || (f === 'content.ts' && !keepContent)) continue;
    writeFileSync(join(out, 'effects', f), rewriteAliases(readFileSync(join(src, f), 'utf8')));
    if (f !== 'content.ts') effects.push(f);
  }
  for (const f of readdirSync(join(root, 'src/lib'))) copy(`src/lib/${f}`, out, `effects/lib/${f}`);
  copy('src/templates/types.ts', out, 'effects/types.ts');

  for (const f of files) {
    if (f === 'style.css' || f.endsWith('.astro')) copy(`src/templates/${style.slug}/${f}`, out, `reference/${f}`);
  }

  writeFileSync(
    join(out, 'README.md'),
    `# ${style.name} style kit

${style.summary}

| File | Use |
|---|---|
| \`tokens.css\` | Design tokens on \`:root\`. Import once globally. The only place raw colors and font stacks live. |
| \`fonts.html\` | \`<link>\` tags for the fonts. Add to the document \`<head>\` (or use the framework's font loader with the same families). |
| \`effects/*.ts\` | Signature effects (${effects.join(', ') || 'none'}). Each exports an \`init…(element)\` function; call it client-side after mount. They read colors from the tokens at init and respect \`prefers-reduced-motion\`. |
| \`effects/lib/\` | Shared helpers the effects import (tokens, motion, canvas). |
| \`reference/\` | The original \`style.css\` and markup — mine them for type scale, spacing, buttons and section patterns. Not meant to be imported as-is. |
${keepContent ? '| `effects/content.ts` | Demo content and types some effects import (data, labels). Replace values with your own. |\n' : ''}
## Integrate
1. Import \`tokens.css\` globally and add the font links.
2. Replace hardcoded colors and font families in existing components with \`var(--token)\`; derive alpha variants with \`color-mix(in srgb, var(--token) N%, transparent)\`.
3. Port the type scale, spacing and component treatments from \`reference/style.css\` onto the existing markup.
4. Mount effects where they fit (usually the hero). In React: call \`init…(ref.current)\` in \`useEffect\`.
${style.three ? '5. This style uses `three` — install it (`npm i three`) before using its effect.\n' : ''}`,
  );

  console.log(`Created ${style.name} style kit at ${out}
  tokens.css, fonts.html, effects/ (${effects.join(', ') || 'none'}), reference/, README.md`);
}

// ---------- main ----------

const [cmd, ...rest] = process.argv.slice(2);
const { pos, flags } = parseArgs(rest);
switch (cmd) {
  case 'list':
    list(flags);
    break;
  case 'deal':
    deal(pos.join(' '), flags);
    break;
  case 'template':
    template(findStyle(pos[0]), prepareOut(flags.out), flags);
    break;
  case 'style':
    styleKit(findStyle(pos[0]), prepareOut(flags.out));
    break;
  default:
    console.log(`usage:
  weft.mjs list [--json]
  weft.mjs deal "<brief>" [--n 3] [--json]
  weft.mjs template <style> --out <dir> [--name <kebab-name>]
  weft.mjs style <style> --out <dir>`);
    if (cmd && cmd !== 'help' && cmd !== '--help') process.exit(1);
}
