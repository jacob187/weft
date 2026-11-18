/** Cards lean toward the pointer in 3D and settle back on leave. */
export function initTilt(cards: Iterable<HTMLElement>): void {
  for (const card of cards) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  }
}

/** Buttons drift toward the pointer while hovered. */
export function initMagnetic(buttons: Iterable<HTMLElement>): void {
  for (const btn of buttons) {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  }
}

/** Keep `el` showing the visitor's local time (h:mm). */
export function initClockText(el: HTMLElement): void {
  const update = () => {
    el.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  update();
  setInterval(update, 10000);
}
