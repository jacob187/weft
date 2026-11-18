import { scrolledClass } from '~/lib/motion';

/** Fill `bar` to the page scroll fraction and collapse `masthead` once scrolled past 90px. */
export function initMasthead(bar: HTMLElement, masthead: Element): void {
  addEventListener(
    'scroll',
    () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    },
    { passive: true },
  );
  scrolledClass(masthead, 90, 'compact');
}
