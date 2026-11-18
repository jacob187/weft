import type { MoodId } from './content';
import { initRain } from './rain';
import { initSky } from './sky';

/** Start the sky + rain layers inside `header` and wire the `.mode[data-mode]` buttons to them. */
export function initHero(header: HTMLElement): void {
  const skyCanvas = header.querySelector<HTMLCanvasElement>('#skygl');
  const rainCanvas = header.querySelector<HTMLCanvasElement>('#rainfx');
  if (!skyCanvas || !rainCanvas) return;
  const sky = initSky(skyCanvas);
  const rain = initRain(rainCanvas);

  const buttons = header.querySelectorAll<HTMLButtonElement>('.mode');
  for (const btn of buttons) {
    btn.addEventListener('click', () => {
      for (const b of buttons) b.classList.remove('on');
      btn.classList.add('on');
      const id = btn.dataset.mode as MoodId;
      sky?.setMood(id);
      rain.setActive(id === 'rain');
    });
  }
}
