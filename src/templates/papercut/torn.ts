/** Seed of the deterministic generator, so every build tears the paper the same way. */
const SEED = 5;

/** Which side of the box a ragged edge runs along. */
type Edge = 'top' | 'right' | 'bottom' | 'left';

/**
 * Give each element a ragged `clip-path` polygon.
 * Elements are torn in document order from one shared Park–Miller (16807) sequence.
 */
export function tearEdges(els: Iterable<HTMLElement>): void {
  let seed = SEED;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  /** `n + 1` polygon points along one edge, each pushed inward by up to 2.4%. */
  const jag = (n: number, edge: Edge): string[] => {
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 100;
      const j = rnd() * 2.4;
      if (edge === 'top') pts.push(`${t.toFixed(1)}% ${j.toFixed(2)}%`);
      if (edge === 'right') pts.push(`${(100 - +j.toFixed(2)).toFixed(2)}% ${t.toFixed(1)}%`);
      if (edge === 'bottom') pts.push(`${(100 - t).toFixed(1)}% ${(100 - +j.toFixed(2)).toFixed(2)}%`);
      if (edge === 'left') pts.push(`${j.toFixed(2)}% ${(100 - t).toFixed(1)}%`);
    }
    return pts;
  };

  for (const el of els) {
    const poly = [...jag(9, 'top'), ...jag(7, 'right'), ...jag(9, 'bottom'), ...jag(7, 'left')].join(',');
    el.style.clipPath = `polygon(${poly})`;
  }
}
