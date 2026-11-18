const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Give each element a wobbly brush underline: an SVG path stretched to the element's width,
 * with its length stored in `--len` so CSS can draw it with a dash-offset animation.
 * Marks the element `.brush-head.rv` so the shared reveal observer triggers the stroke.
 */
export function initBrushHeads(els: Iterable<Element>): void {
  for (const el of els) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 120 22'); // normalized; stretches to element width
    svg.setAttribute('preserveAspectRatio', 'none');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M4 13 C 22 9, 44 15, 62 11 S 100 12, 116 9');
    svg.appendChild(path);
    el.classList.add('brush-head', 'rv');
    el.appendChild(svg);
    if (el instanceof HTMLElement) el.style.setProperty('--len', path.getTotalLength().toFixed(0));
  }
}
