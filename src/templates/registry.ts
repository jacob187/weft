import type { TemplateMeta } from './types';

/**
 * All template metadata, ordered by showcase number.
 * Only meta.ts is globbed: globbing Template.astro would pull every template's global CSS into every page.
 */
const modules = import.meta.glob<{ default: TemplateMeta }>('./*/meta.ts', { eager: true });

export const templates: TemplateMeta[] = Object.values(modules)
  .map((m) => m.default)
  .filter((m) => /^\d{2}$/.test(m.no))
  .sort((a, b) => a.no.localeCompare(b.no));
