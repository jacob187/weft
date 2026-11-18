import { rafLoop } from '~/lib/canvas';
import { token } from '~/lib/tokens';

const NS = 'http://www.w3.org/2000/svg';

interface DialColors {
  face: string;
  face2: string;
  idx: string;
  hand: string;
  sec: string;
}

export interface WatchOptions {
  size: number;
  /** Dial finish: reads the `--dial-<dial>-*` tokens. */
  dial: string;
  brand: string;
  place: string;
  /** Makes gradient ids unique when several watches share a page. */
  uid: string;
  /** Run the hands from the system clock; otherwise they pose at 10:08. */
  live: boolean;
}

function dialColors(dial: string): DialColors {
  const t = (part: string) => token(`--dial-${dial}-${part}`);
  return { face: t('face'), face2: t('face2'), idx: t('idx'), hand: t('hand'), sec: t('sec') };
}

const rotate = (deg: number) => `rotate(${deg} 100 100)`;

/** Build an SVG watch face; hands are live (rAF) or posed at 10:08. */
export function buildWatch({ size, dial, brand, place, uid, live }: WatchOptions): SVGSVGElement {
  const c = dialColors(dial);
  const edge = token('--dial-edge');
  const ink = token('--ink');
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.classList.add('dial');

  let g = `<defs>
    <radialGradient id="g-${uid}" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="${c.face2}"/><stop offset="70%" stop-color="${c.face}"/>
      <stop offset="100%" stop-color="${edge}"/></radialGradient>
    <linearGradient id="rim-${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${token('--gold-hi')}"/><stop offset="45%" stop-color="${token('--gold-lo')}"/>
      <stop offset="70%" stop-color="${token('--gold-mid')}"/><stop offset="100%" stop-color="${token('--gold-deep')}"/></linearGradient>
  </defs>`;
  g += `<circle cx="100" cy="100" r="97" fill="url(#rim-${uid})"/>`;
  g += `<circle cx="100" cy="100" r="90" fill="${ink}"/>`;
  g += `<circle cx="100" cy="100" r="86" fill="url(#g-${uid})"/>`;
  // minute track
  for (let i = 0; i < 60; i++) {
    const a = (i * 6 * Math.PI) / 180;
    const r1 = 82;
    const r2 = i % 5 === 0 ? 74 : 79;
    const x1 = 100 + Math.sin(a) * r1;
    const y1 = 100 - Math.cos(a) * r1;
    const x2 = 100 + Math.sin(a) * r2;
    const y2 = 100 - Math.cos(a) * r2;
    g += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
      stroke="${c.idx}" stroke-width="${i % 5 === 0 ? 2.4 : 0.8}" opacity="${i % 5 === 0 ? 1 : 0.45}"/>`;
  }
  g += `<text class="brand" x="100" y="62" text-anchor="middle" fill="${c.idx}"
    font-size="11.5" letter-spacing="4" opacity=".9"></text>`;
  g += `<text class="place" x="100" y="146" text-anchor="middle" fill="${c.idx}"
    font-style="italic" font-size="7.5" letter-spacing="2" opacity=".65"></text>`;
  g += `<g class="hr"><line x1="100" y1="106" x2="100" y2="55" stroke="${c.hand}" stroke-width="4.6" stroke-linecap="round"/></g>`;
  g += `<g class="mn"><line x1="100" y1="108" x2="100" y2="34" stroke="${c.hand}" stroke-width="3" stroke-linecap="round"/></g>`;
  g += `<g class="sc"><line x1="100" y1="114" x2="100" y2="26" stroke="${c.sec}" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="100" cy="100" r="4.6" fill="${c.sec}"/></g>`;
  g += `<circle cx="100" cy="100" r="2" fill="${ink}"/>`;
  svg.innerHTML = g;

  const text = (cls: string, value: string) => {
    const el = svg.querySelector(`text.${cls}`);
    if (el) el.textContent = value;
  };
  text('brand', brand);
  text('place', place);

  const hr = svg.querySelector('.hr');
  const mn = svg.querySelector('.mn');
  const sc = svg.querySelector('.sc');
  if (!hr || !mn || !sc) return svg;

  if (live) {
    rafLoop(() => {
      const n = new Date();
      const sec = n.getSeconds() + n.getMilliseconds() / 1000;
      const min = n.getMinutes() + sec / 60;
      const hh = (n.getHours() % 12) + min / 60;
      sc.setAttribute('transform', rotate(sec * 6));
      mn.setAttribute('transform', rotate(min * 6));
      hr.setAttribute('transform', rotate(hh * 30));
    }).start();
  } else {
    // classic 10:08 pose
    hr.setAttribute('transform', rotate(305));
    mn.setAttribute('transform', rotate(48));
    sc.setAttribute('transform', rotate(210));
  }
  return svg;
}
