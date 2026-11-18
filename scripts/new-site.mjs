#!/usr/bin/env node
/**
 * Scaffold a new site from a template.
 *
 *   npm run new-site -- <template> <site-name>
 *   npm run new-site -- obsidian acme-watches
 *   npm run new-site -- 01 acme-watches        (showcase number also works)
 *
 * Creates:
 *   src/sites/<site-name>/site.ts             content + theme overrides (edit this)
 *   src/pages/sites/<site-name>/index.astro   route at /sites/<site-name>/
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const templatesDir = join(root, 'src/templates');

function fail(msg) {
  console.error(`new-site: ${msg}`);
  process.exit(1);
}

function listTemplates() {
  return readdirSync(templatesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(templatesDir, d.name, 'Template.astro')))
    .map((d) => {
      const metaSrc = readFileSync(join(templatesDir, d.name, 'meta.ts'), 'utf8');
      const no = metaSrc.match(/\bno:\s*'([^']*)'/)?.[1] ?? '';
      return { slug: d.name, no };
    });
}

const [rawTemplate, rawName] = process.argv.slice(2);
const templates = listTemplates();
if (!rawTemplate || !rawName) {
  const names = templates.map((t) => (t.no ? `${t.no}-${t.slug}` : t.slug)).join(', ');
  fail(`usage: npm run new-site -- <template> <site-name>\n  templates: ${names}`);
}

const key = rawTemplate.trim().toLowerCase();
const tpl = templates.find(
  (t) => t.slug === key || (t.no && (t.no === key.padStart(2, '0') || `${t.no}-${t.slug}` === key)),
);
if (!tpl) fail(`unknown template "${rawTemplate}"`);

const name = rawName.trim().toLowerCase();
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 60) {
  fail(`site name must be kebab-case (a-z, 0-9, single hyphens), max 60 chars: "${rawName}"`);
}

const siteDir = join(root, 'src/sites', name);
const pageDir = join(root, 'src/pages/sites', name);
if (existsSync(siteDir) || existsSync(pageDir)) fail(`site "${name}" already exists`);

mkdirSync(siteDir, { recursive: true });
mkdirSync(pageDir, { recursive: true });

writeFileSync(
  join(siteDir, 'site.ts'),
  `import type { Seo, ThemeOverrides } from '~/templates/types';
import { demo, type Content } from '~/templates/${tpl.slug}/content';

/**
 * ${name} — built on the "${tpl.slug}" template.
 * Start from the template's demo copy and replace fields; TypeScript will flag anything missing.
 */
export const content: Content = {
  ...demo,
};

/** Token overrides, e.g. { '--accent': '#ff5500' }. See src/templates/${tpl.slug}/theme.css for the list. */
export const theme: ThemeOverrides = {};

/** <head> overrides (title, description, favicon, themeColor...). */
export const seo: Partial<Seo> = {};
`,
);

writeFileSync(
  join(pageDir, 'index.astro'),
  `---
import Template from '~/templates/${tpl.slug}/Template.astro';
import { content, theme, seo } from '~/sites/${name}/site';
---

<Template content={content} theme={theme} seo={seo} />
`,
);

console.log(`Created site "${name}" from template "${tpl.slug}":
  src/sites/${name}/site.ts
  src/pages/sites/${name}/index.astro
Preview: npm run dev → http://localhost:4321/sites/${name}/`);
