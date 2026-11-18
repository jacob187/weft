/**
 * Contracts shared by every template. A template is a folder in src/templates/<slug>/:
 *
 *   meta.ts        TemplateMeta (default export): gallery card + <head> defaults. No CSS imports.
 *   content.ts     `export interface Content` + `export const demo: Content` (the original demo copy).
 *   theme.css      Design tokens on :root (palette, font stacks). The only place raw colors live.
 *   style.css      Layout + components. Uses var(--token) only.
 *   Template.astro Renders <Page> with content; props are TemplateProps<Content>.
 *   *.ts           Client effects (shaders, particles, audio). Read colors from tokens at runtime.
 */

/** CSS custom-property overrides applied inline on <html>, e.g. { '--gold': '#7cc4ff' }. */
export type ThemeOverrides = Record<`--${string}`, string>;

/** Per-page <head> data. Templates fill defaults from meta + content; sites may override. */
export interface Seo {
  title: string;
  description: string;
  /** <meta name="theme-color">. */
  themeColor?: string;
  /** Full favicon href, usually an SVG data URI. */
  favicon?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface TemplateProps<C> {
  content: C;
  theme?: ThemeOverrides;
  /** Partial <head> overrides layered over the template's defaults. */
  seo?: Partial<Seo>;
  /**
   * Showcase chrome: the "← Fable Showcase" hub chip and "Part of the Fable Showcase" footer line.
   * True only on the /NN-slug/ demo routes; derived sites leave it off.
   */
  showcase?: boolean;
}

export interface TemplateMeta {
  /** Folder name in src/templates, e.g. "obsidian". */
  slug: string;
  /** Two-digit showcase number, e.g. "01". */
  no: string;
  /** Display name on the gallery card, e.g. "OBSIDIAN". */
  name: string;
  /** One-sentence gallery description. */
  summary: string;
  /** Signature technique tag, e.g. "RAYMARCH GLSL". */
  technique: string;
  /** Three swatch colors for the gallery card (bg, primary, accent). */
  swatch: [string, string, string];
  /** Google Fonts stylesheet href (or undefined when the template uses system fonts). */
  fontsHref?: string;
  /** Default favicon (SVG data URI). */
  favicon: string;
  /** Default theme-color. */
  themeColor: string;
}

/** Route for a template's demo page. */
export const demoPath = (m: Pick<TemplateMeta, 'no' | 'slug'>) => `/${m.no}-${m.slug}/`;
