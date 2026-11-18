import { rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';

/** Hero wordmark: pointer X sweeps the width axis (50–150), pointer Y the weight axis (900–200), eased. */
export function initHeroType(el: HTMLElement): void {
  if (prefersReducedMotion()) return;
  let tw = 120;
  let tg = 900;
  let cw = 120;
  let cg = 900;
  addEventListener('pointermove', (e) => {
    tw = 50 + (e.clientX / innerWidth) * 100;
    tg = 900 - (e.clientY / innerHeight) * 700;
  });
  rafLoop(() => {
    cw += (tw - cw) * 0.09;
    cg += (tg - cg) * 0.09;
    el.style.fontVariationSettings = `"wdth" ${cw.toFixed(1)},"wght" ${Math.round(cg)}`;
  }).start();
}

const SCRAMBLE_CHARS = '█▓▒░ABCDEFGHIKLMNOPRSTUVXYZ#%&';

/** Re-type `el`'s text from glitch characters, settling left to right. Ignored while already running. */
function scramble(el: HTMLElement): void {
  if (el.dataset.busy) return;
  el.dataset.busy = '1';
  const orig = (el.dataset.orig ??= el.textContent ?? '');
  let i = 0;
  const iv = setInterval(() => {
    el.textContent = orig
      .split('')
      .map((c, j) =>
        j < i ? orig[j] : c === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
      )
      .join('');
    i += 0.8;
    if (i >= orig.length) {
      el.textContent = orig;
      clearInterval(iv);
      delete el.dataset.busy;
    }
  }, 28);
}

/** Scramble each row's `[data-scramble]` text when the pointer enters the row. */
export function initScramble(rows: Iterable<HTMLElement>): void {
  for (const row of rows) {
    const el = row.querySelector<HTMLElement>('[data-scramble]');
    if (el) row.addEventListener('pointerenter', () => scramble(el));
  }
}

/** Live type tester: three range inputs (`data-axis` = wdth | wght | size) drive the editable text. */
export function initTester(text: HTMLElement, inputs: Iterable<HTMLInputElement>): void {
  const fields = Array.from(inputs, (input) => ({
    input,
    output: input.closest('.ctl')?.querySelector('output') ?? null,
  }));
  const value = (axis: string) => fields.find((f) => f.input.dataset.axis === axis)?.input.value ?? '';
  const update = () => {
    for (const f of fields) if (f.output) f.output.value = f.input.value;
    text.style.fontVariationSettings = `"wdth" ${value('wdth')},"wght" ${value('wght')}`;
    text.style.fontSize = `${value('size')}px`;
  };
  for (const f of fields) f.input.addEventListener('input', update);
  update();
}

/** Count `[data-count]` numbers up from 0 (ease-out cubic, 1.4s) the first time they are half visible. */
export function initCountUp(els: Iterable<HTMLElement>): void {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        const end = Number(el.dataset.count);
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / 1400);
          el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        step(t0);
        io.unobserve(el);
      }
    },
    { threshold: 0.5 },
  );
  for (const el of els) io.observe(el);
}

/** Cycle `el` through its `data-messages` (JSON array) every 4.2s. */
export function initTicker(el: HTMLElement): void {
  const messages: string[] = JSON.parse(el.dataset.messages ?? '[]');
  if (messages.length < 2) return;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % messages.length;
    el.textContent = messages[i];
  }, 4200);
}
