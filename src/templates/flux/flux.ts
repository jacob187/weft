import type { Content, KeelingSeries } from './content';
import { countUps } from './counts';
import { keeling } from './keeling';
import { readScale } from './scale';
import { spiral } from './spiral';
import { stripes } from './stripes';

/** Chart data serialized by Template.astro into `#flux-data`. */
export interface ChartData {
  climate: Content['climate'];
  spiral: Pick<Content['spiral'], 'months' | 'rings'>;
  keeling: KeelingSeries;
}

/** Wire up the stripes, spiral, Keeling curve and count-ups from the page's markup and `#flux-data`. */
export function initFlux(): void {
  const json = document.getElementById('flux-data')?.textContent;
  if (!json) return;
  const data: ChartData = JSON.parse(json);
  const { anomalies, scaleStops, unit } = data.climate;
  const scale = readScale(scaleStops);

  const stripesEl = document.getElementById('stripes');
  const readout = document.getElementById('stripeRead');
  if (stripesEl instanceof HTMLCanvasElement && readout) {
    stripes({ canvas: stripesEl, readout, anomalies, scale, unit, idle: readout.dataset.idle ?? '' });
  }

  const spiralEl = document.getElementById('spiral');
  const yearEl = document.getElementById('spYear');
  if (spiralEl instanceof HTMLCanvasElement && yearEl) {
    spiral({ canvas: spiralEl, yearEl, anomalies, scale, ...data.spiral });
  }

  const keelEl = document.getElementById('keelChart');
  if (keelEl instanceof SVGSVGElement) keeling(keelEl, data.keeling);

  countUps(document.querySelectorAll<HTMLElement>('[data-count]'));
}
