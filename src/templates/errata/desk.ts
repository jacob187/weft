/** Inputs for the hero desk, serialised into `data-config` by Template.astro. */
export interface DeskConfig {
  closeGlyph: string;
  spawn: {
    titles: string[];
    bodies: string[];
    interventionAt: number;
    intervention: { title: string; heading: string; text: string };
  };
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

/**
 * Hero desk behaviour: draggable windows (`[data-drag]`, dragged by their `.bar`), close boxes
 * (`[data-x]`), and the DO NOT CLICK button (`#donot`) that spawns more windows and counts them in `#spawnCount`.
 */
export function initDesk(desk: HTMLElement): void {
  const cfg = JSON.parse(desk.dataset.config ?? '{}') as DeskConfig;
  const { spawn } = cfg;
  let z = 10;

  /** `flatten` drops the window's tilt when a drag starts. */
  const makeDraggable = (win: HTMLElement, flatten = false) => {
    const bar = win.querySelector<HTMLElement>('.bar');
    if (!bar) return;
    let sx = 0;
    let sy = 0;
    let ox = 0;
    let oy = 0;
    let drag = false;
    win.addEventListener('pointerdown', () => (win.style.zIndex = String(++z)));
    bar.addEventListener('pointerdown', (e) => {
      if (e.target instanceof HTMLElement && e.target.dataset.x !== undefined) return;
      drag = true;
      const r = win.getBoundingClientRect();
      const pr = desk.getBoundingClientRect();
      ox = r.left - pr.left;
      oy = r.top - pr.top;
      sx = e.clientX;
      sy = e.clientY;
      win.style.left = `${ox}px`;
      win.style.top = `${oy}px`;
      win.style.right = 'auto';
      win.style.bottom = 'auto';
      if (flatten) win.style.transform = 'none';
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener('pointermove', (e) => {
      if (!drag) return;
      win.style.left = `${ox + e.clientX - sx}px`;
      win.style.top = `${oy + e.clientY - sy}px`;
    });
    bar.addEventListener('pointerup', () => (drag = false));
  };

  for (const win of desk.querySelectorAll<HTMLElement>('[data-drag]')) makeDraggable(win);

  document.addEventListener('click', (e) => {
    if (!(e.target instanceof HTMLElement) || e.target.dataset.x === undefined) return;
    const w = e.target.closest<HTMLElement>('.win');
    if (!w) return;
    w.style.transition = 'transform .25s,opacity .25s';
    w.style.transform = 'scale(.9) rotate(-2deg)';
    w.style.opacity = '0';
    setTimeout(() => w.remove(), 260);
  });

  const addWindow = (title: string, body: HTMLElement[], style: string, flatten: boolean) => {
    const w = el('div', 'win');
    const bar = el('div', 'bar');
    const x = el('span', 'x', cfg.closeGlyph);
    x.dataset.x = '';
    bar.append(el('span', undefined, title), x);
    const content = el('div', 'body');
    content.append(...body);
    w.append(bar, content);
    w.style.cssText = style;
    desk.appendChild(w);
    makeDraggable(w, flatten);
  };

  const count = document.getElementById('spawnCount');
  const button = document.getElementById('donot');
  let n = 0;
  button?.addEventListener('click', () => {
    n++;
    if (count) count.textContent = String(n);
    const x = 8 + Math.random() * 64;
    const y = 14 + Math.random() * 58;
    const rot = (Math.random() * 8 - 4).toFixed(1);
    addWindow(
      spawn.titles[n % spawn.titles.length],
      [el('p', undefined, spawn.bodies[n % spawn.bodies.length])],
      `left:${x}%;top:${y}%;max-width:250px;z-index:${++z};transform:rotate(${rot}deg)`,
      true,
    );
    if (n === spawn.interventionAt) {
      const { title, heading, text } = spawn.intervention;
      addWindow(
        title,
        [el('p', 'big', heading), el('p', undefined, text)],
        `left:20%;top:36%;max-width:420px;z-index:${++z}`,
        false,
      );
    }
  });
}
