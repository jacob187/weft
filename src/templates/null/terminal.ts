import { prefersReducedMotion } from '~/lib/motion';
import type { TerminalCommand, TerminalLine, TerminalScript } from './content';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Interactive shell inside `body`, driven entirely by `script` (boot text, commands, not-found
 * reply). Supports command history with the arrow keys and click-to-focus.
 */
export function initTerminal(body: HTMLElement, script: TerminalScript): void {
  const reduced = prefersReducedMotion();
  const commands = new Map<string, TerminalCommand>(script.commands.map((c) => [c.name.toLowerCase(), c]));
  const history: string[] = [];
  let historyIndex = -1;
  let input: HTMLInputElement | null = null;

  const scrollToEnd = () => {
    body.scrollTop = body.scrollHeight;
  };

  const line = (text: string, tone?: TerminalLine['tone']): HTMLDivElement => {
    const d = document.createElement('div');
    d.className = tone ? `ln ${tone}` : 'ln';
    d.textContent = text;
    body.appendChild(d);
    scrollToEnd();
    return d;
  };

  const typeLine = async (text: string, tone: TerminalLine['tone'], speed: number) => {
    const d = line('', tone);
    if (reduced) {
      d.textContent = text;
      return;
    }
    for (let i = 0; i <= text.length; i++) {
      d.textContent = text.slice(0, i);
      scrollToEnd();
      await sleep(speed);
    }
  };

  const promptSpan = () => {
    const p = document.createElement('span');
    p.className = 'p';
    p.textContent = script.prompt;
    return p;
  };

  const newPrompt = () => {
    const row = document.createElement('div');
    row.className = 'in-row';
    const inp = document.createElement('input');
    inp.className = 'cmd';
    inp.autocomplete = 'off';
    inp.spellcheck = false;
    inp.setAttribute('aria-label', script.inputLabel);
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    row.append(promptSpan(), inp, cursor);
    body.appendChild(row);
    input = inp;

    const fitWidth = () => {
      inp.style.width = `${inp.value.length + 1}ch`;
    };
    const recall = (index: number) => {
      historyIndex = index;
      inp.value = history[historyIndex] ?? '';
      fitWidth();
    };
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = inp.value;
        const typed = document.createElement('span');
        typed.textContent = value;
        row.replaceChildren(promptSpan(), typed);
        input = null;
        void run(value.trim());
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length) recall(Math.max(0, historyIndex - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (history.length) recall(Math.min(history.length, historyIndex + 1));
      }
    });
    inp.addEventListener('input', fitWidth);
    scrollToEnd();
    if (matchMedia('(pointer:fine)').matches) inp.focus({ preventScroll: true });
  };

  const print = async (lines: TerminalLine[]) => {
    for (const l of lines) {
      if (l.delay && !reduced) await sleep(l.delay);
      line(l.text, l.tone);
    }
  };

  const run = async (raw: string) => {
    if (raw) {
      history.push(raw);
      historyIndex = history.length;
    }
    const [name, ...rest] = raw.split(/\s+/);
    if (!name) {
      newPrompt();
      return;
    }
    const cmd = commands.get(name.toLowerCase());
    if (!cmd) {
      await print(script.notFound.map((l) => ({ ...l, text: l.text.replace('{cmd}', () => name) })));
    } else if (cmd.clear) {
      body.querySelectorAll('.ln,.in-row').forEach((n) => n.remove());
    } else {
      const arg = rest.join(' ');
      await print(cmd.argument && arg.includes(cmd.argument.contains) ? cmd.argument.lines : cmd.lines);
    }
    newPrompt();
  };

  body.addEventListener('click', () => input?.focus({ preventScroll: true }));

  void (async () => {
    for (const l of script.boot) {
      if (l.speed) await typeLine(l.text, l.tone, l.speed);
      else line(l.text, l.tone);
    }
    newPrompt();
  })();
}
