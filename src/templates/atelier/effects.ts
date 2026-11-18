import { reveal } from '~/lib/motion';

/**
 * Prepare the `.drawable` SVGs for their draw-in animation: every stroke gets its own dash length
 * (`--l`) and a random start delay, and the `drawn` class is added once the drawing is 30% in view.
 */
export function initDrawings(svgs: Iterable<SVGElement>): void {
  for (const svg of svgs) {
    svg.querySelectorAll<SVGGeometryElement>('path,line,rect,circle,polyline').forEach((el) => {
      let len = 600;
      try {
        len = el.getTotalLength();
      } catch {
        // not rendered yet: keep the default dash length
      }
      el.style.setProperty('--l', String(Math.ceil(len)));
      el.style.animationDelay = `${Math.random() * 0.9}s`;
    });
  }
  reveal(svgs, { className: 'drawn', threshold: 0.3 });
}

/**
 * Let the vertical mouse wheel scroll the gallery sideways, handing the wheel back to the page
 * once the gallery is at either end.
 */
export function initWheelScroll(gallery: HTMLElement): void {
  gallery.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const canScroll = gallery.scrollWidth > gallery.clientWidth;
      const atStart = gallery.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2 && e.deltaY > 0;
      if (canScroll && !atStart && !atEnd) {
        e.preventDefault();
        gallery.scrollLeft += e.deltaY;
      }
    },
    { passive: false },
  );
}
