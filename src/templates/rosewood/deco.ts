import type { SuiteGlyph } from './content';

/**
 * Build-time SVG generators for the Art Deco ornaments. Strokes and fills use `currentColor`
 * (or CSS classes styled from theme tokens), so a theme override recolors them.
 */

const TAU = Math.PI * 2;

/** The 900×900 hero sunburst: 48 rays, concentric rings and eight stepped arcs. */
export function sunburstSvg(): string {
  const cx = 450;
  const cy = 450;
  let g =
    '<defs><radialGradient id="fadeg" cx="50%" cy="50%" r="50%">' +
    '<stop offset="0%" stop-color="currentColor" stop-opacity=".5"/>' +
    '<stop offset="55%" stop-color="currentColor" stop-opacity=".16"/>' +
    '<stop offset="100%" stop-color="currentColor" stop-opacity="0"/></radialGradient></defs>';
  for (let i = 0; i < 48; i++) {
    const a = i * (TAU / 48);
    const r1 = 120;
    const r2 = i % 2 === 0 ? 430 : 330;
    g += `<line x1="${cx + Math.cos(a) * r1}" y1="${cy + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}" stroke="url(#fadeg)" stroke-width="${i % 2 === 0 ? 2 : 1}"/>`;
  }
  [140, 150, 300, 310, 420].forEach((r, i) => {
    g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-opacity="${0.28 - i * 0.04}" stroke-width="${i % 2 ? 0.8 : 1.4}"/>`;
  });
  for (let k = 0; k < 8; k++) {
    const a0 = k * (Math.PI / 4) - Math.PI / 32;
    g += `<path d="M ${cx + Math.cos(a0) * 180} ${cy + Math.sin(a0) * 180} A 180 180 0 0 1 ${cx + Math.cos(a0 + Math.PI / 16) * 180} ${cy + Math.sin(a0 + Math.PI / 16) * 180}" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="5"/>`;
  }
  return g;
}

/** Peaked ornament above the hero heading. */
export const decoTopSvg = `<svg width="220" height="34" viewBox="0 0 220 34" fill="none">
  <path d="M0 30 L88 30 L110 6 L132 30 L220 30" stroke="currentColor" stroke-width="1.4"/>
  <path d="M74 30 L110 14 L146 30" stroke="currentColor" stroke-width="1" opacity=".6"/>
  <circle cx="110" cy="6" r="3" fill="currentColor"/>
  <circle cx="0" cy="30" r="2" fill="currentColor"/><circle cx="220" cy="30" r="2" fill="currentColor"/>
</svg>`;

/** Five-stroke skyline mark used in the wordmark. */
export const brandMarkSvg = (size: number): string =>
  `<svg width="${size}" height="${size}" viewBox="0 0 32 32"><path d="M16 28 L16 8 M10 28 L10 13 M22 28 L22 13 M5 28 L5 18 M27 28 L27 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="4.5" r="2" fill="currentColor"/></svg>`;

const GLYPHS: Record<SuiteGlyph, string> = {
  fan: `<svg width="80" height="64" viewBox="0 0 80 64" fill="none">
      ${[...Array(7)]
        .map((_, i) => {
          const a = Math.PI - i * (Math.PI / 6);
          return `<line x1="40" y1="58" x2="${40 + Math.cos(a) * 46}" y2="${58 - Math.sin(a) * 46}" stroke="currentColor" stroke-width="1.5"/>`;
        })
        .join('')}
      <path d="M-2 58 A 46 46 0 0 1 82 58" stroke="currentColor" stroke-width="1.5" fill="none" transform="translate(-2 0) scale(.955 1)"/>
      <circle cx="40" cy="58" r="4" fill="currentColor"/></svg>`,
  chevron: `<svg width="80" height="64" viewBox="0 0 80 64" fill="none">
      ${[0, 1, 2, 3]
        .map(
          (i) =>
            `<path d="M12 ${18 + i * 11} L40 ${6 + i * 11} L68 ${18 + i * 11}" stroke="currentColor" stroke-width="1.6" opacity="${1 - i * 0.18}"/>`,
        )
        .join('')}</svg>`,
  arch: `<svg width="80" height="64" viewBox="0 0 80 64" fill="none">
      <path d="M16 60 L16 30 A 24 24 0 0 1 64 30 L64 60" stroke="currentColor" stroke-width="1.6"/>
      <path d="M26 60 L26 34 A 14 14 0 0 1 54 34 L54 60" stroke="currentColor" stroke-width="1.2" opacity=".65"/>
      <line x1="8" y1="60" x2="72" y2="60" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="40" cy="20" r="2.5" fill="currentColor"/></svg>`,
};

export const glyphSvg = (glyph: SuiteGlyph): string => GLYPHS[glyph];

/** Static face of the elevator dial: rim, seven ticks, needle group (id `needle`) and hub. */
export function liftDialSvg(): string {
  let g = '<circle class="rim" cx="28" cy="28" r="26"/>';
  for (let i = 0; i <= 6; i++) {
    const a = Math.PI * (1 + i / 6);
    g += `<line class="tick" x1="${28 + Math.cos(a) * 20}" y1="${28 + Math.sin(a) * 20}" x2="${28 + Math.cos(a) * 24}" y2="${28 + Math.sin(a) * 24}"/>`;
  }
  g += '<g id="needle"><line class="hand" x1="28" y1="28" x2="8" y2="28"/></g><circle class="hub" cx="28" cy="28" r="3"/>';
  return g;
}
