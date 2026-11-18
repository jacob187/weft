/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<a>/<br>/<code> only). */
export interface Link {
  label: string;
  href: string;
}

/** Color class of a terminal line: phosphor-bright `ok`, dim, amber `warn`, red `err`, or plain phosphor `accent`. */
export type LineTone = 'ok' | 'dim' | 'warn' | 'err' | 'accent';

export interface TerminalLine {
  text: string;
  /** Omit for the default text color. */
  tone?: LineTone;
  /** Type the line out character by character, this many ms per character. Omit to print instantly. */
  speed?: number;
  /** Wait this many ms before printing (skipped under reduced motion). */
  delay?: number;
}

export interface TerminalCommand {
  /** What the visitor types (case-insensitive). */
  name: string;
  /** Output lines, printed in order. */
  lines: TerminalLine[];
  /** Wipe the screen instead of printing. */
  clear?: boolean;
  /** If the argument text contains `contains`, print these lines instead of `lines` (e.g. `cat flag.txt`). */
  argument?: { contains: string; lines: TerminalLine[] };
}

/** Everything the interactive shell does. Passed to the terminal module as JSON. */
export interface TerminalScript {
  /** Prompt printed before every input, including the trailing space. */
  prompt: string;
  /** Accessible name of the text input. */
  inputLabel: string;
  /** Lines typed out on load, before the first prompt. */
  boot: TerminalLine[];
  commands: TerminalCommand[];
  /** Printed for an unknown command; `{cmd}` is replaced by what was typed. */
  notFound: TerminalLine[];
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Logo: the second half is rendered in the plain text color. */
  brand: { first: string; second: string };
  /** Top-bar links, written as they appear (rendered lowercase after a `./`). */
  nav: Link[];
  /** Blinking-dot status text at the right of the top bar. */
  status: string;
  terminal: TerminalScript & {
    /** Title in the terminal window's title bar. */
    title: string;
    /** Hint under the terminal; `<b>` renders dimmer-bold. */
    hintHtml: string;
  };
  /** Scrolling marquee items; each is an HTML fragment (`<b>` highlights). */
  stripHtml: string[];
  services: {
    id: string;
    tag: string;
    /** `<em>` renders phosphor green with a glow; `<br>` allowed. */
    headingHtml: string;
    items: {
      /** Script filename in the card header. */
      file: string;
      /** Flag text at the right of the card header. */
      flag: string;
      title: string;
      body: string;
      /** Footer line rendered as `key: value`, the value in amber. */
      output: { key: string; value: string };
    }[];
  };
  disclosure: {
    id: string;
    tag: string;
    /** `<em>` renders phosphor green with a glow. */
    headingHtml: string;
    /** Title inside the policy box. */
    policyTitle: string;
    /** Policy text; `<code>` renders as an amber chip. */
    bodyHtml: string;
  };
  contact: {
    id: string;
    tag: string;
    /** `<em>` renders phosphor green with a glow. */
    headingHtml: string;
    /** Shell lines shown after a `$` prompt. */
    shell: string[];
  };
  footer: {
    /** `<br>` allowed. */
    noteHtml: string;
    /** Credit line above the showcase link (`<a>` allowed). */
    creditHtml?: string;
  };
}

export const demo: Content = {
  seo: {
    title: 'NULLSECTOR — Offensive Defense',
    description:
      "NULLSECTOR is a fictional security firm. We break in so others can't. Try the terminal: type 'help'.",
    ogTitle: 'NULLSECTOR — Offensive Defense',
    ogDescription: "We break in so others can't. Type 'help'.",
  },
  brand: { first: 'NULL', second: 'SECTOR' },
  nav: [
    { label: 'services', href: '#services' },
    { label: 'disclosure', href: '#disclosure' },
    { label: 'contact', href: '#contact' },
  ],
  status: 'ALL SYSTEMS HOSTILE (OURS)',
  terminal: {
    title: 'guest@nullsector: ~',
    hintHtml: 'THIS TERMINAL IS REAL · TYPE <b>help</b> AND PRESS ENTER',
    prompt: 'guest@nullsector:~$ ',
    inputLabel: 'terminal input',
    boot: [
      { text: 'NULLSECTOR industries — secure shell v9.1', tone: 'ok', speed: 8 },
      { text: 'establishing encrypted session………… done', tone: 'dim', speed: 6 },
      { text: 'auth: guest access granted (we see you)', tone: 'dim', speed: 6 },
      { text: '' },
      { text: "Welcome. We break in so others can't.", speed: 10 },
      { text: "Type 'help' to see what this shell can do.", tone: 'dim', speed: 8 },
      { text: '' },
    ],
    commands: [
      {
        name: 'help',
        lines: [
          { text: 'available commands:', tone: 'accent' },
          { text: '  help        this menu' },
          { text: '  about       who we are' },
          { text: '  services    what we break' },
          { text: '  scan        run a (fake) perimeter scan' },
          { text: '  contact     reach the operators' },
          { text: '  whoami      identity check' },
          { text: '  clear       wipe the screen' },
          { text: '  matrix      ░░░░░░░░░░' },
        ],
      },
      {
        name: 'about',
        lines: [
          { text: 'NULLSECTOR — offensive security, defensive outcomes.', tone: 'ok' },
          { text: 'Founded by three people who kept finding the same bug in different banks.' },
          { text: 'We are hired to think like the worst person on the internet, with a contract.' },
        ],
      },
      {
        name: 'services',
        lines: [
          { text: 'redteam.sh   — full-scope adversary simulation', tone: 'ok' },
          { text: 'appsec.sh    — code review with a grudge', tone: 'ok' },
          { text: 'ir.sh        — incident response, 15-min human', tone: 'ok' },
          { text: 'train.sh     — your team vs. us, best of three', tone: 'ok' },
          { text: 'scroll down for details ↓', tone: 'dim' },
        ],
      },
      {
        name: 'scan',
        lines: [
          { text: 'initiating perimeter scan (simulated, relax)…', tone: 'warn' },
          { text: 'resolving target………………… localhost', tone: 'dim', delay: 260 },
          { text: 'port 22/ssh ……………………… filtered', tone: 'dim', delay: 260 },
          { text: 'port 80/http …………………… open', tone: 'dim', delay: 260 },
          { text: 'port 443/https ………………… open', tone: 'dim', delay: 260 },
          { text: 'port 3306/mysql ……………… CLOSED (good)', tone: 'ok', delay: 260 },
          { text: 'checking default creds …… none found', tone: 'ok', delay: 260 },
          { text: 'checking your patience …… vulnerable', tone: 'warn', delay: 260 },
          { text: 'scan complete. 0 critical, 1 lesson.', tone: 'ok', delay: 260 },
        ],
      },
      {
        name: 'contact',
        lines: [
          { text: 'ops@nullsector.example        (engagements)', tone: 'ok' },
          { text: 'security@nullsector.example   (disclosure)', tone: 'ok' },
          { text: 'PGP: 0xNULL5EC70R — verify twice, trust once.', tone: 'dim' },
        ],
      },
      {
        name: 'whoami',
        lines: [{ text: 'guest (uid=1000)  clearance: none  vibes: immaculate' }],
      },
      { name: 'clear', lines: [], clear: true },
      {
        name: 'matrix',
        lines: [
          { text: 'wake up, neo… the showcase has you.', tone: 'ok' },
          { text: '(the rain is already behind this page — look closer)', tone: 'dim' },
        ],
      },
      {
        name: 'sudo',
        lines: [
          { text: 'user is not in the sudoers file. this incident will be reported.', tone: 'err' },
          { text: '…to absolutely no one. but still.', tone: 'dim' },
        ],
      },
      {
        name: 'exit',
        lines: [{ text: 'there is no exit. only the footer.', tone: 'warn' }],
      },
      {
        name: 'ls',
        lines: [{ text: 'services/  disclosure/  contact/  flag.txt', tone: 'dim' }],
      },
      {
        name: 'cat',
        lines: [{ text: 'cat: specify a file. try: cat flag.txt', tone: 'dim' }],
        argument: {
          contains: 'flag',
          lines: [{ text: 'FLAG{curiosity_is_the_job_description} — nice instinct.', tone: 'ok' }],
        },
      },
    ],
    notFound: [
      { text: 'command not found: {cmd}', tone: 'err' },
      { text: "type 'help' for the menu", tone: 'dim' },
    ],
  },
  stripHtml: [
    '<b>1,204</b> engagements',
    '<b>0</b> breaches on our watch',
    'CVE credits: <b>38</b>',
    'mean time to first shell: <b>4h 12m</b>',
    'coffee consumed: <b>ERR_OVERFLOW</b>',
  ],
  services: {
    id: 'services',
    tag: 'services',
    headingHtml: 'We break in, <em>politely.</em><br>Then we tell you everything.',
    items: [
      {
        file: 'redteam.sh',
        flag: '--full-scope',
        title: 'Red Team Operations',
        body: 'Six weeks, no warning, one goal you choose. We attempt exactly what a real adversary would, minus the ransom note.',
        output: { key: 'exit_code', value: 'you_will_want_a_meeting' },
      },
      {
        file: 'appsec.sh',
        flag: '--deep',
        title: 'Application Security',
        body: 'Code review and live testing by people who write exploits before breakfast. We read your source like a threat actor with a grudge.',
        output: { key: 'avg_findings', value: '23 per engagement' },
      },
      {
        file: 'ir.sh',
        flag: '--now',
        title: 'Incident Response',
        body: "Already on fire? Retainer clients get a human in 15 minutes and a war room in 60. We've seen worse. We've fixed worse.",
        output: { key: 'hotline', value: 'always_answered' },
      },
      {
        file: 'train.sh',
        flag: '--humans',
        title: 'Adversary Training',
        body: 'Your engineers defend a live environment while we attack it. Rage, then enlightenment, then significantly better logging.',
        output: { key: 'satisfaction', value: '0.97 ± rage' },
      },
    ],
  },
  disclosure: {
    id: 'disclosure',
    tag: 'disclosure',
    headingHtml: 'Found something in <em>our</em> perimeter?',
    policyTitle: 'RESPONSIBLE DISCLOSURE POLICY',
    bodyHtml:
      "Report vulnerabilities to <code>security@nullsector.example</code> (PGP on the contact page). We reply within 24 hours, fix within 30 days, credit you publicly unless you'd rather stay a ghost, and never — ever — send lawyers where a thank-you belongs. Swag tier scales with severity. Critical findings get the black hoodie.",
  },
  contact: {
    id: 'contact',
    tag: 'contact',
    headingHtml: 'Talk to us <em>before</em> someone else does.',
    shell: [
      'gpg --recv-keys 0xNULL5EC70R',
      'echo "we should talk" | mail ops@nullsector.example',
      "# or just type 'contact' in the terminal above",
    ],
  },
  footer: {
    noteHtml: 'A fictional security firm.<br>No packets were harmed. Much.',
    creditHtml: 'Designed &amp; built autonomously by <a href="/guide/">Claude Fable 5</a>',
  },
};
