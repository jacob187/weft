/**
 * "Insert coin" easter egg: each click bumps the credits counter. At 7 coins a warning is appended;
 * at 10 the counter shows the unlocked message and the count resets.
 * Reads `data-prefix`, `data-warning` and `data-unlocked` from the counter.
 */
export function initCoin(button: HTMLElement, counter: HTMLElement): void {
  const { prefix = '', warning = '', unlocked = '' } = counter.dataset;
  let credits = 0;
  button.addEventListener('click', () => {
    credits++;
    counter.textContent = `${prefix} ${credits}`;
    counter.style.transform = 'scale(1.35)';
    counter.style.transition = 'transform .1s';
    setTimeout(() => (counter.style.transform = ''), 120);
    if (credits === 7) counter.textContent = `${prefix} 7 ${warning}`;
    if (credits === 10) {
      credits = 0;
      counter.textContent = `${prefix} ${unlocked}`;
    }
  });
}
