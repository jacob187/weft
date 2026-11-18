/** Motion helpers shared across templates. */

export const prefersReducedMotion = (): boolean =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface RevealOptions {
  /** Class added once the element intersects. Default "in". */
  className?: string;
  threshold?: number;
  rootMargin?: string;
  /** Per-element transitionDelay = (index % staggerEvery) * stagger seconds. Omit for no stagger. */
  stagger?: number;
  staggerEvery?: number;
  /** Called once per element when it is revealed. */
  onReveal?: (el: Element) => void;
}

/**
 * Add a class to elements the first time they scroll into view (the `.rv` → `.rv.in` pattern).
 * Returns the observer so callers can disconnect it.
 */
export function reveal(
  selector: string | Iterable<Element>,
  {
    className = 'in',
    threshold = 0.1,
    rootMargin,
    stagger,
    staggerEvery = 4,
    onReveal,
  }: RevealOptions = {},
): IntersectionObserver {
  const els = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add(className);
        onReveal?.(e.target);
        io.unobserve(e.target);
      }
    },
    { threshold, rootMargin },
  );
  let i = 0;
  for (const el of els) {
    if (stagger !== undefined && el instanceof HTMLElement) {
      el.style.transitionDelay = `${(i % staggerEvery) * stagger}s`;
    }
    io.observe(el);
    i++;
  }
  return io;
}

/** Toggle a class on `el` when the page scrolls past `offset` px (sticky-nav pattern). */
export function scrolledClass(el: Element, offset = 40, className = 'scrolled'): void {
  const update = () => el.classList.toggle(className, scrollY > offset);
  addEventListener('scroll', update, { passive: true });
  update();
}
