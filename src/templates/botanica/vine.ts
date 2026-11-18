import { rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { token } from '~/lib/tokens';

const NS = 'http://www.w3.org/2000/svg';
/** ViewBox height mapped to the viewport height. */
const H = 1100;

interface Decoration {
  g: SVGGElement;
  /** Transform without the growth scale. */
  base: string;
  /** Final growth scale. */
  scale: number;
  /** Fraction of the page scroll at which this node sprouts. */
  frac: number;
  shown: boolean;
}

/**
 * A seeded, meandering vine in a fixed side rail. Its stem draws itself with page scroll and
 * leaves/blossoms pop out as the stem passes their node. Colors come from the palette tokens.
 */
export function initVine(rail: HTMLElement): void {
  const reduced = prefersReducedMotion();
  const moss = token('--moss');
  const leaf = token('--leaf');
  const paper = token('--paper');
  const terra = token('--terra');
  const gold = token('--gold');

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 150 ${H}`);
  svg.setAttribute('width', '150');
  svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
  rail.appendChild(svg);

  // seeded rng for a stable-but-organic vine
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // main stem: meandering cubic path downward
  let d = 'M 22 -20';
  let x = 22;
  let y = -20;
  const nodes: { x: number; y: number }[] = [];
  while (y < H + 40) {
    const ny = y + 55 + rnd() * 50;
    const nx = 10 + rnd() * 26;
    const c1x = x + (rnd() * 40 - 20);
    const c1y = y + (ny - y) * 0.4;
    const c2x = nx + (rnd() * 40 - 20);
    const c2y = y + (ny - y) * 0.75;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${nx.toFixed(1)} ${ny.toFixed(1)}`;
    nodes.push({ x: nx, y: ny });
    x = nx;
    y = ny;
  }
  const stem = document.createElementNS(NS, 'path');
  stem.setAttribute('d', d);
  stem.setAttribute('fill', 'none');
  stem.setAttribute('stroke', moss);
  stem.setAttribute('stroke-width', '3');
  stem.setAttribute('stroke-linecap', 'round');
  svg.appendChild(stem);
  const stemLen = stem.getTotalLength();
  stem.style.strokeDasharray = String(stemLen);
  stem.style.strokeDashoffset = String(stemLen);

  // leaves + blossoms at nodes
  const decorations: Decoration[] = nodes.map((n, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    const g = document.createElementNS(NS, 'g');
    const rot = side === 1 ? -20 - rnd() * 30 : 200 + rnd() * 30;
    let base: string;
    let scale: number;
    if (rnd() < 0.78) {
      scale = 0.5 + rnd() * 0.45;
      g.innerHTML = `<path d="M0 0 C 10 -14, 34 -16, 46 0 C 34 16, 10 14, 0 0 Z"
        fill="${rnd() < 0.5 ? moss : leaf}" opacity="0.92"/>
        <path d="M2 0 L 43 0" stroke="${paper}" stroke-width="1" opacity=".5"/>`;
      base = `translate(${n.x},${n.y}) rotate(${rot})`;
    } else {
      let petals = '';
      for (let p = 0; p < 5; p++) {
        petals += `<ellipse cx="0" cy="-9" rx="4.6" ry="9" fill="${terra}" opacity=".92"
          transform="rotate(${p * 72})"/>`;
      }
      petals += `<circle r="3.6" fill="${gold}"/>`;
      g.innerHTML = petals;
      scale = 0.8 + rnd() * 0.5;
      base = `translate(${n.x},${n.y})`;
    }
    g.style.transformOrigin = `${n.x}px ${n.y}px`;
    g.setAttribute('transform', `${base} scale(0)`);
    svg.appendChild(g);
    return { g, base, scale, frac: Math.min(1, Math.max(0, n.y / H)), shown: false };
  });

  let target = 0;
  let current = 0;
  const measure = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    target = max > 0 ? scrollY / max : 0;
  };
  addEventListener('scroll', measure, { passive: true });
  addEventListener('resize', measure);
  measure();
  if (reduced) current = target = 1;

  rafLoop(() => {
    current += (target - current) * 0.06;
    if (reduced) current = 1;
    stem.style.strokeDashoffset = String(stemLen * (1 - current));
    for (const o of decorations) {
      const on = current >= o.frac - 0.02;
      if (on === o.shown) continue;
      o.shown = on;
      o.g.style.transition = 'transform .8s cubic-bezier(.34,1.56,.64,1)';
      o.g.setAttribute('transform', `${o.base} scale(${on ? o.scale : 0})`);
    }
  }).start();
}
