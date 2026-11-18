import { token } from '~/lib/tokens';

/** Page scroll position as 0–1 (0 when the page is not scrollable). */
export function scrollProgress(): number {
  const max = document.documentElement.scrollHeight - innerHeight;
  return max > 0 ? scrollY / max : 0;
}

export interface DepthMeterEls {
  /** Vertical text readout, e.g. "1,200 M". */
  read: HTMLElement;
  /** Bar that fills top-down with scroll progress. */
  fill: HTMLElement;
  /** Fixed gradient background scrolled by progress. */
  bg: HTMLElement;
}

/**
 * Drive the depth readout, fill bar and background gradient from scroll progress.
 * Reads `data-max` (depth at page bottom) and `data-unit` from the readout element.
 */
export function depthMeter({ read, fill, bg }: DepthMeterEls): void {
  const max = Number(read.dataset.max);
  const unit = read.dataset.unit ?? '';
  const span = parseFloat(token('--sea-span'));
  const update = () => {
    const p = scrollProgress();
    read.textContent = `${Math.round(p * max).toLocaleString()} ${unit}`;
    fill.style.height = `${p * 100}%`;
    bg.style.backgroundPosition = `0 ${-p * (span - innerHeight)}px`;
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}
