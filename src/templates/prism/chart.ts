import { prefersReducedMotion } from '~/lib/motion';
import { token } from '~/lib/tokens';

const W = 520;
const H = 110;
const N = 40;
const clamp = (v: number) => Math.max(14, Math.min(90, v));

/**
 * Balance line chart: the line draws itself on first render, then a new random-walk point
 * slides in every 1.8s. With reduced motion it renders once, static.
 */
export function initChart(svg: SVGSVGElement): void {
  const mint = token('--mint');
  const vio = token('--vio');
  const reduced = prefersReducedMotion();

  const data: number[] = [];
  let v = 40;
  for (let i = 0; i < N; i++) {
    v += Math.sin(i * 0.4) * 6 + (Math.random() - 0.5) * 10;
    v = clamp(v);
    data.push(v);
  }

  const path = () =>
    data
      .map((y, i) => {
        const x = (i / (N - 1)) * W;
        const yy = H - y;
        return i === 0 ? `M ${x} ${yy}` : ` L ${x} ${yy.toFixed(1)}`;
      })
      .join('');

  let drawn = false;
  const render = () => {
    const d = path();
    svg.innerHTML = `
      <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${mint}" stop-opacity=".3"/>
        <stop offset="100%" stop-color="${mint}" stop-opacity="0"/></linearGradient>
      <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${mint}"/><stop offset="100%" stop-color="${vio}"/></linearGradient></defs>
      <path d="${d} L ${W} ${H} L 0 ${H} Z" fill="url(#area)"/>
      <path id="ln" d="${d}" fill="none" stroke="url(#line)" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="${W}" cy="${H - data[N - 1]}" r="4" fill="${vio}">
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/></circle>`;
    if (!reduced && !drawn) {
      const ln = svg.querySelector<SVGPathElement>('#ln');
      if (!ln) return;
      const len = ln.getTotalLength();
      ln.style.strokeDasharray = String(len);
      ln.style.strokeDashoffset = String(len);
      ln.style.transition = 'stroke-dashoffset 2s cubic-bezier(.22,1,.36,1)';
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          ln.style.strokeDashoffset = '0';
        }),
      );
      drawn = true;
    }
  };

  render();
  if (!reduced) {
    setInterval(() => {
      data.push(clamp(data[N - 1] + (Math.random() - 0.5) * 12));
      data.shift();
      render();
    }, 1800);
  }
}
