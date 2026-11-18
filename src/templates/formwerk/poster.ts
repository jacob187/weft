import { token } from '~/lib/tokens';
import { prefersReducedMotion } from '~/lib/motion';

/** Poster canvas in SVG user units. */
const W = 400;
const H = 564;

/** Copy and seeds that feed the generator; serialised into `data-config` by Template.astro. */
export interface PosterConfig {
  words: string[];
  titles: string[];
  numberSign: string;
  stampBefore: string;
  stampAfter: string;
  downloadPrefix: string;
  initialSeed: number;
}

/** Colors and font stacks read from design tokens, as plain strings that survive an SVG download. */
interface Palette {
  red: string;
  blue: string;
  yellow: string;
  blk: string;
  paper: string;
  disp: string;
  body: string;
}

const pad = (seed: number) => String(seed).padStart(4, '0');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function mkRnd(s: number): () => number {
  let x = (s * 2654435761) % 2147483647;
  if (x <= 0) x += 2147483646;
  return () => (x = (x * 16807) % 2147483647) / 2147483647;
}

/** Caption shown under the poster for a seed, e.g. "AUSSTELLUNG №4". */
export function posterTitle(seed: number, titles: string[], numberSign: string): string {
  const rnd = mkRnd(seed + 3);
  return `${titles[Math.floor(rnd() * titles.length)]} ${numberSign}${1 + Math.floor(rnd() * 9)}`;
}

function readPalette(): Palette {
  // Quotes would terminate the SVG font-family attribute.
  const stack = (name: `--${string}`) => token(name).replaceAll('"', '');
  return {
    red: token('--red'),
    blue: token('--blue'),
    yellow: token('--yellow'),
    blk: token('--blk'),
    paper: token('--paper'),
    disp: stack('--disp'),
    body: stack('--body'),
  };
}

/** Inner SVG markup of the poster for a seed. */
function poster(seedVal: number, cfg: PosterConfig, p: Palette): string {
  const { red: RED, blue: BLUE, yellow: YEL, blk: BLK, paper: BONE } = p;
  const rnd = mkRnd(seedVal + 7);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];
  const cols = [RED, BLUE, YEL];
  // shuffle color roles
  const c1 = pick(cols);
  const c2 = pick(cols.filter((c) => c !== c1));
  const c3 = cols.find((c) => c !== c1 && c !== c2);
  let g = `<rect width="${W}" height="${H}" fill="${BONE}"/>`;
  const archetype = Math.floor(rnd() * 4);

  // margin grid lines (subtle)
  g += `<line x1="30" y1="0" x2="30" y2="${H}" stroke="${BLK}" stroke-opacity=".08"/>
      <line x1="${W - 30}" y1="0" x2="${W - 30}" y2="${H}" stroke="${BLK}" stroke-opacity=".08"/>`;

  if (archetype === 0) {
    // BIG CIRCLE
    const r = 90 + rnd() * 70;
    const cx = 110 + rnd() * (W - 220);
    const cy = 120 + rnd() * 160;
    g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c1}"/>`;
    // crossing diagonal bar
    const bw = 26 + rnd() * 30;
    g += `<g transform="rotate(${-38 + rnd() * 20} ${W / 2} ${H / 2})">
      <rect x="-60" y="${H * 0.42}" width="${W + 120}" height="${bw}" fill="${BLK}"/></g>`;
    g += `<rect x="46" y="${H - 170}" width="${60 + rnd() * 40}" height="${60 + rnd() * 40}" fill="${c2}"/>`;
    g += `<circle cx="${W - 80}" cy="${H - 120}" r="16" fill="${c3}"/>`;
  }
  if (archetype === 1) {
    // STACKED BARS
    const n = 4 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      const bh = 26 + rnd() * 44;
      const by = 70 + (i * (H - 200)) / n;
      const bwd = W * (0.34 + rnd() * 0.55);
      const bx = rnd() < 0.5 ? 0 : W - bwd;
      g += `<rect x="${bx}" y="${by}" width="${bwd}" height="${bh}" fill="${[c1, c2, BLK][i % 3]}"/>`;
    }
    const r = 44 + rnd() * 36;
    g += `<circle cx="${80 + rnd() * (W - 160)}" cy="${H - 150}" r="${r}" fill="${c3}"/>`;
  }
  if (archetype === 2) {
    // TRIANGLE MOUNTAIN
    const tw = W * (0.6 + rnd() * 0.36);
    const tx = rnd() * (W - tw);
    g += `<path d="M${tx} ${H - 40} L${tx + tw / 2} ${140 + rnd() * 120} L${tx + tw} ${H - 40} Z" fill="${c1}"/>`;
    g += `<circle cx="${70 + rnd() * (W - 140)}" cy="${100 + rnd() * 80}" r="${34 + rnd() * 30}" fill="${c2}"/>`;
    const bw = 18 + rnd() * 22;
    g += `<g transform="rotate(${20 + rnd() * 24} ${W / 2} ${H / 2})">
      <rect x="-60" y="${H * 0.3}" width="${W + 120}" height="${bw}" fill="${BLK}"/></g>`;
    g += `<rect x="${W - 130}" y="${H - 130}" width="70" height="70" fill="${c3}" transform="rotate(12 ${W - 95} ${H - 95})"/>`;
  }
  if (archetype === 3) {
    // QUADRANT SPLIT
    g += `<rect x="0" y="0" width="${W * 0.55}" height="${H * 0.45}" fill="${c1}"/>`;
    g += `<rect x="${W * 0.55}" y="${H * 0.45}" width="${W * 0.45}" height="${H * 0.3}" fill="${c2}"/>`;
    g += `<circle cx="${W * 0.55}" cy="${H * 0.45}" r="${44 + rnd() * 30}" fill="${BLK}"/>`;
    g += `<circle cx="${W * 0.55}" cy="${H * 0.45}" r="${18 + rnd() * 10}" fill="${c3}"/>`;
    const n = 3 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      g += `<line x1="${W * 0.62 + i * 16}" y1="${H * 0.82}" x2="${W * 0.5 + i * 16}" y2="${H - 30}" stroke="${BLK}" stroke-width="5"/>`;
    }
  }

  // the word
  const word = esc(pick(cfg.words));
  const fs = 54 + rnd() * 46;
  const wy = H - 60 - rnd() * 60;
  const rot = rnd() < 0.42 ? (rnd() < 0.5 ? -90 : 0) : 0;
  if (rot === -90) {
    const wx = 40 + rnd() * 40;
    g += `<text x="${wx}" y="${wy}" font-family="${p.disp}" font-size="${fs}"
      fill="${BLK}" transform="rotate(-90 ${wx} ${wy})">${word}</text>`;
  } else {
    g += `<text x="${34 + rnd() * 30}" y="${wy}" font-family="${p.disp}" font-size="${fs}"
      fill="${BLK}">${word}</text>`;
  }
  // small metadata line
  g += `<text x="34" y="${H - 18}" font-family="${p.body}" font-weight="600"
    font-size="10" letter-spacing="3" fill="${BLK}">${esc(cfg.stampBefore)}${pad(seedVal)}${esc(cfg.stampAfter)}</text>`;
  return g;
}

/**
 * Wire up the poster machine inside `root`: the big poster (#poster), its controls
 * (#gen, #dl, #seedTxt, #titleTxt), the Space shortcut and the `.mini[data-seed]` strip.
 * Configuration arrives as JSON in `root.dataset.config`.
 */
export function initPosterMachine(root: HTMLElement): void {
  const posterEl = root.querySelector<SVGSVGElement>('#poster');
  const genBtn = root.querySelector<HTMLButtonElement>('#gen');
  const dlBtn = root.querySelector<HTMLButtonElement>('#dl');
  const seedTxt = root.querySelector<HTMLElement>('#seedTxt');
  const titleTxt = root.querySelector<HTMLElement>('#titleTxt');
  if (!posterEl || !genBtn || !dlBtn || !seedTxt || !titleTxt) return;

  const cfg = JSON.parse(root.dataset.config ?? '{}') as PosterConfig;
  const pal = readPalette();
  let seed = cfg.initialSeed;

  const render = (s: number, animate = true) => {
    seed = s;
    posterEl.innerHTML = poster(s, cfg, pal);
    seedTxt.textContent = pad(s);
    titleTxt.textContent = posterTitle(s, cfg.titles, cfg.numberSign);
    if (animate && !prefersReducedMotion()) {
      posterEl.animate(
        [
          { opacity: 0.2, transform: 'scale(.985)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' },
      );
    }
  };
  const randomSeed = () => Math.floor(Math.random() * 9999) + 1;

  genBtn.addEventListener('click', () => render(randomSeed()));
  addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName ?? '';
    if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'BUTTON'].includes(tag)) {
      e.preventDefault();
      render(randomSeed());
    }
  });
  dlBtn.addEventListener('click', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="800" height="1128">${posterEl.innerHTML}</svg>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    a.download = `${cfg.downloadPrefix}-${pad(seed)}.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  for (const mini of root.querySelectorAll<HTMLElement>('.mini[data-seed]')) {
    const s = Number(mini.dataset.seed);
    mini.innerHTML = `<svg viewBox="0 0 ${W} ${H}">${poster(s, cfg, pal)}</svg>`;
    mini.addEventListener('click', () => {
      render(s);
      scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  render(cfg.initialSeed, false);
}
