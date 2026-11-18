/**
 * Highlight the slot baking right now. Each `.slot` carries its start hour in `data-hour`;
 * a slot runs until the next one starts (the last until midnight). Before the first slot of
 * the day, the first one is highlighted.
 */
export function markNowSlot(slots: HTMLElement[], hour = new Date().getHours()): void {
  const hours = slots.map((s) => Number(s.dataset.hour));
  let now = hours.findIndex((h, i) => hour >= h && hour < (hours[i + 1] ?? 24));
  if (now === -1) now = hour < hours[0] ? 0 : slots.length - 1;
  slots[now]?.classList.add('now');
}
