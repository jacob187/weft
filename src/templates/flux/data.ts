import type { Anomaly } from './content';

/**
 * Stylized global temperature anomalies (shape of NASA GISTEMP), one value per year.
 * Demo data only — a real site passes its own series in `Content.climate.anomalies`.
 */
export function stylizedAnomalies(startYear: number, endYear: number): Anomaly[] {
  const out: Anomaly[] = [];
  for (let y = startYear; y <= endYear; y++) {
    let a: number;
    if (y < 1910) a = -0.25 + Math.sin(y * 0.7) * 0.08;
    else if (y < 1945) a = -0.3 + (y - 1910) * 0.014 + Math.sin(y * 0.9) * 0.07;
    else if (y < 1975) a = 0.05 - (y - 1945) * 0.004 + Math.sin(y * 1.3) * 0.08;
    else a = -0.05 + (y - 1975) * 0.026 + Math.sin(y * 0.8) * 0.06;
    if (y >= 2015) a += 0.1 + (y - 2015) * 0.012;
    out.push({ year: y, value: +a.toFixed(3) });
  }
  return out;
}

/**
 * Stylized atmospheric CO₂ (shape of the Scripps Keeling curve): an accelerating rise plus a
 * once-a-year sawtooth, sampled at `samples + 1` evenly spaced points. Demo data only.
 */
export function stylizedKeeling(startYear: number, endYear: number, samples: number): number[] {
  const out: number[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const base = 315 + t * t * 82 + t * 28; // accelerating rise
    const saw = Math.sin(t * (endYear - startYear) * Math.PI * 2) * 3.2;
    out.push(base + saw);
  }
  return out;
}
