import type { DrawingKind } from './content';

/**
 * Build-time generators for the line elevations. Every stroke is `currentColor`
 * (the `.drawable` class sets it from the `--ink` token), so theme overrides recolor the drawings.
 */

const S = 'stroke="currentColor"';

function grid(x: number, y: number, w: number, h: number, cols: number, rows: number, sw = 1): string {
  let g = '';
  for (let i = 0; i <= cols; i++) {
    g += `<line x1="${x + (i * w) / cols}" y1="${y}" x2="${x + (i * w) / cols}" y2="${y + h}" ${S} stroke-width="${sw}"/>`;
  }
  for (let j = 0; j <= rows; j++) {
    g += `<line x1="${x}" y1="${y + (j * h) / rows}" x2="${x + w}" y2="${y + (j * h) / rows}" ${S} stroke-width="${sw}"/>`;
  }
  return g;
}

function ground(y: number, x0: number, x1: number): string {
  let g = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" ${S} stroke-width="2"/>`;
  for (let x = x0; x < x1; x += 14) {
    g += `<line x1="${x}" y1="${y}" x2="${x - 8}" y2="${y + 8}" ${S} stroke-width="1"/>`;
  }
  return g;
}

function tree(x: number, y: number, s = 1): string {
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 22 * s}" ${S} stroke-width="1.4"/>
  <circle cx="${x}" cy="${y - 32 * s}" r="${11 * s}" ${S} stroke-width="1.4" fill="none"/>`;
}

function person(x: number, y: number): string {
  return `<circle cx="${x}" cy="${y - 14}" r="2.6" ${S} stroke-width="1.2" fill="none"/>
  <line x1="${x}" y1="${y - 11}" x2="${x}" y2="${y}" ${S} stroke-width="1.2"/>`;
}

const DRAWINGS: Record<DrawingKind, () => string> = {
  /** Long low house. */
  house() {
    let g = ground(340, 20, 540);
    g += `<rect x="60" y="240" width="420" height="100" ${S} stroke-width="2" fill="none"/>`;
    g += `<line x1="40" y1="240" x2="500" y2="240" ${S} stroke-width="2.4"/>`; // roof slab
    g += `<line x1="40" y1="232" x2="500" y2="232" ${S} stroke-width="1"/>`;
    g += grid(80, 258, 160, 64, 5, 2);
    g += `<rect x="270" y="258" width="60" height="82" ${S} stroke-width="1.4" fill="none"/>`; // door
    g += grid(350, 258, 110, 64, 3, 2);
    g += `<line x1="120" y1="240" x2="120" y2="200" ${S} stroke-width="1.4"/>
        <rect x="104" y="176" width="32" height="24" ${S} stroke-width="1.4" fill="none"/>`; // chimney
    g += tree(530, 340, 1.1) + tree(30, 340, 0.8) + person(255, 340);
    return g;
  },
  /** Stepped tower: base widest, aligned setbacks. */
  tower() {
    let g = ground(350, 30, 530);
    g += `<rect x="180" y="240" width="200" height="110" ${S} stroke-width="2" fill="none"/>`;
    g += `<rect x="205" y="150" width="150" height="90" ${S} stroke-width="2" fill="none"/>`;
    g += `<rect x="232" y="60" width="96" height="90" ${S} stroke-width="2" fill="none"/>`;
    g += grid(192, 252, 176, 86, 8, 3, 0.8);
    g += grid(215, 160, 130, 70, 6, 3, 0.8);
    g += grid(242, 70, 76, 70, 3, 3, 0.8);
    g += `<line x1="174" y1="240" x2="386" y2="240" ${S} stroke-width="2.4"/>`;
    g += `<line x1="199" y1="150" x2="361" y2="150" ${S} stroke-width="2.2"/>`;
    g += `<line x1="226" y1="60" x2="334" y2="60" ${S} stroke-width="2.2"/>`;
    g += `<line x1="280" y1="60" x2="280" y2="28" ${S} stroke-width="1.2"/>
        <line x1="272" y1="28" x2="288" y2="28" ${S} stroke-width="1.6"/>`; // antenna
    g += tree(90, 350, 1) + tree(130, 350, 0.7) + tree(470, 350, 1.2) + person(155, 350) + person(430, 350);
    return g;
  },
  /** Curved roof on twelve columns, in the rain. */
  pavilion() {
    let g = ground(330, 30, 530);
    g += `<path d="M60 200 Q280 150 500 200" ${S} stroke-width="2.4" fill="none"/>`; // curved roof
    g += `<path d="M60 208 Q280 158 500 208" ${S} stroke-width="1" fill="none"/>`;
    for (let i = 0; i < 12; i++) {
      const x = 90 + i * (380 / 11);
      const yr = 204 - Math.sin((i / 11) * Math.PI) * 24 + 4;
      g += `<line x1="${x}" y1="${yr + 6}" x2="${x}" y2="330" ${S} stroke-width="1.6"/>`;
    }
    g += `<line x1="70" y1="330" x2="490" y2="330" ${S} stroke-width="2"/>`; // plinth
    g += `<line x1="80" y1="338" x2="480" y2="338" ${S} stroke-width="1.2"/>`;
    for (let i = 0; i < 26; i++) {
      const rx = 60 + i * 17;
      g += `<line x1="${rx}" y1="${96 + (i % 5) * 8}" x2="${rx - 4}" y2="${112 + (i % 5) * 8}" ${S} stroke-width=".8" opacity=".5"/>`;
    }
    g += person(280, 330) + tree(40, 330, 0.9) + tree(520, 330, 0.9);
    return g;
  },
  /** Gabled chapel with one very narrow window. */
  chapel() {
    let g = ground(350, 40, 520);
    g += `<path d="M170 350 L170 130 L280 70 L390 130 L390 350" ${S} stroke-width="2.2" fill="none"/>`;
    g += `<line x1="278" y1="90" x2="278" y2="330" ${S} stroke-width="1"/>
        <line x1="282" y1="90" x2="282" y2="330" ${S} stroke-width="1"/>`; // narrow light
    g += `<line x1="170" y1="200" x2="390" y2="200" ${S} stroke-width=".8" opacity=".5"/>
        <line x1="170" y1="270" x2="390" y2="270" ${S} stroke-width=".8" opacity=".5"/>`;
    g += `<rect x="255" y="300" width="30" height="50" ${S} stroke-width="1.4" fill="none"/>`;
    g += `<line x1="280" y1="70" x2="280" y2="40" ${S} stroke-width="1.4"/>
        <line x1="270" y1="52" x2="290" y2="52" ${S} stroke-width="1.4"/>`; // cross
    g += tree(80, 350, 1) + tree(470, 350, 1.1) + person(120, 350);
    return g;
  },
  /** A house spanning a river. */
  bridge() {
    let g = '';
    g += `<path d="M30 300 L180 300 L200 330 L200 380" ${S} stroke-width="2" fill="none"/>`; // banks
    g += `<path d="M530 300 L380 300 L360 330 L360 380" ${S} stroke-width="2" fill="none"/>`;
    for (let i = 0; i < 4; i++) {
      g += `<path d="M210 ${344 + i * 10} q20 -6 40 0 t40 0 t40 0 t20 0" ${S} stroke-width=".9" fill="none" opacity=".6"/>`; // river
    }
    g += `<rect x="150" y="220" width="260" height="80" ${S} stroke-width="2.2" fill="none"/>`; // house
    g += grid(162, 232, 236, 56, 8, 2, 0.8);
    g += `<line x1="130" y1="220" x2="430" y2="220" ${S} stroke-width="2.6"/>`; // roof
    g += `<line x1="150" y1="300" x2="180" y2="300" ${S} stroke-width="2"/>`;
    g += `<line x1="180" y1="300" x2="230" y2="330" ${S} stroke-width="1.4"/>
        <line x1="380" y1="300" x2="330" y2="330" ${S} stroke-width="1.4"/>
        <line x1="230" y1="330" x2="330" y2="330" ${S} stroke-width="1.4"/>`; // struts
    g += tree(70, 300, 1) + tree(500, 300, 0.9) + person(280, 218);
    return g;
  },
};

export const drawingSvg = (kind: DrawingKind): string => DRAWINGS[kind]();
