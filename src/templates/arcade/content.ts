/** Fields ending in `Html` are trusted, author-written HTML (inline <em>/<b>/<i>/<br>/<a>/<span> only). */
export interface Link {
  label: string;
  href: string;
}

/** Pixel-art sprite drawn on a cabinet. */
export type SpriteId = 'invader' | 'ship' | 'ghost' | 'sword';

/** Palette token a cabinet glows with (`--pink`, `--cyan`, `--yellow`, `--purple`). */
export type Accent = 'pink' | 'cyan' | 'yellow' | 'purple';

export interface Cabinet {
  sprite: SpriteId;
  accent: Accent;
  /** Game title; use <br> to break lines. */
  titleHtml: string;
  genre: string;
  /** High-score line, e.g. "HI 894,210". */
  hi: string;
  /** Small line under the high score. */
  note: string;
}

export interface GameEvent {
  /** Weekday, shown above the time. */
  day: string;
  time: string;
  title: string;
  text: string;
  fee: string;
}

export interface MenuItem {
  name: string;
  sub: string;
  price: string;
}

export interface Content {
  seo: { title: string; description: string; ogTitle?: string; ogDescription?: string };
  /** Brand logo in the nav and footer; <b> glows pink, <i> glows cyan. */
  logoHtml: string;
  /** Section anchors available: #games, #events, #menu. Nav links are hidden below 900px. */
  nav: Link[];
  /** The coin button in the nav and the credits counter it drives. */
  coin: {
    label: string;
    /** Counter prefix, e.g. "CREDITS". */
    credits: string;
    /** Appended at the 7th coin. */
    warning: string;
    /** Replaces the count at the 10th coin. */
    unlocked: string;
  };
  hero: {
    /** Blinking tag on the sign's top edge. */
    open: string;
    /** Sign text: wrap the first word in `<span class="n">` (pink) and the second in `<span class="d">` (cyan). */
    headingHtml: string;
    taglineHtml: string;
  };
  games: { kicker: string; headingHtml: string; cabinets: Cabinet[] };
  events: { kicker: string; headingHtml: string; items: GameEvent[] };
  menu: {
    kicker: string;
    headingHtml: string;
    columns: { title: string; items: MenuItem[] }[];
  };
  footer: { addressHtml: string; gameOver: string; creditHtml: string };
  /** Showcase-only chrome; rendered only when the Template receives `showcase`. */
  showcase?: { chipLabel: string; chipHref: string; footerHtml: string };
}

export const demo: Content = {
  seo: {
    title: 'NEON DISTRICT — Arcade & Bar',
    description: 'NEON DISTRICT: 42 cabinets, cold drinks, hot high scores. A synthwave arcade bar rendered in pure CRT glow.',
    ogTitle: 'NEON DISTRICT — Arcade & Bar',
    ogDescription: '42 cabinets, cold drinks, hot high scores.',
  },
  logoHtml: '<b>NEON</b> <i>DISTRICT</i>',
  nav: [
    { label: 'Games', href: '#games' },
    { label: 'Events', href: '#events' },
    { label: 'Menu', href: '#menu' },
  ],
  coin: { label: 'INSERT COIN', credits: 'CREDITS', warning: '— OK STOP', unlocked: '∞ UNLOCKED' },
  hero: {
    open: "OPEN 'TIL 3AM",
    headingHtml: '<span class="n">NEON</span><br><span class="d">DISTRICT</span>',
    taglineHtml: 'Arcade · Bar · <b>42 cabinets</b> · Est. 1987, rebooted 2024',
  },
  games: {
    kicker: 'SELECT GAME',
    headingHtml: 'The floor is <em>lava.</em><br>The cabinets are original.',
    cabinets: [
      {
        sprite: 'invader',
        accent: 'pink',
        titleHtml: 'VOID<br>INVADERS',
        genre: 'Shooter · 1981',
        hi: 'HI 894,210',
        note: 'HELD BY "AAA" SINCE MARCH',
      },
      {
        sprite: 'ship',
        accent: 'cyan',
        titleHtml: 'HYPER<br>DRIFTER',
        genre: 'Racer · 1986',
        hi: 'HI 1,024,900',
        note: 'DISPUTED. LOUDLY.',
      },
      {
        sprite: 'ghost',
        accent: 'yellow',
        titleHtml: 'MAZE<br>FEVER',
        genre: 'Maze · 1980',
        hi: 'HI 333,360',
        note: 'A PERFECT GAME. WE CHECKED.',
      },
      {
        sprite: 'sword',
        accent: 'purple',
        titleHtml: 'BLADE<br>QUEST II',
        genre: 'Action RPG · 1991',
        hi: 'HI 77,777',
        note: 'THE CABINET EATS QUARTERS. SORRY.',
      },
    ],
  },
  events: {
    kicker: 'WEEKLY ROTATION',
    headingHtml: 'Every night is <em>game night.</em>',
    items: [
      {
        day: 'WED',
        time: '20:00',
        title: 'King of the Hill',
        text: 'Winner stays on. Loser buys the round. House rules, house mercy: none.',
        fee: 'FREE PLAY',
      },
      {
        day: 'FRI',
        time: '21:00',
        title: 'High Score Friday',
        text: 'Beat the monthly record on the featured cabinet, drink free until close.',
        fee: '1 CREDIT',
      },
      {
        day: 'SAT',
        time: '19:00',
        title: 'Couch Co-op Cup',
        text: 'Teams of two, brackets of sixteen, one golden joystick to rule the month.',
        fee: '5 CREDITS',
      },
      {
        day: 'SUN',
        time: '15:00',
        title: 'Family Firmware',
        text: 'Bring a kid, teach them Galaga, lose to them by 18:00. All ages until nine.',
        fee: 'FREE PLAY',
      },
    ],
  },
  menu: {
    kicker: 'POWER-UPS',
    headingHtml: 'Drinks with <em>extra lives.</em>',
    columns: [
      {
        title: '> NEON SLURPS',
        items: [
          { name: 'Blue Shell', sub: 'gin · butterfly pea · citrus fog', price: '$14' },
          { name: 'Konami Cooler', sub: 'rum · pineapple · up up down down', price: '$13' },
          { name: 'Final Boss', sub: 'mezcal · chile · do not order twice', price: '$16' },
          { name: 'Continue? (0%)', sub: 'yuzu soda · no alcohol · all glory', price: '$8' },
        ],
      },
      {
        title: '> SIDE QUESTS',
        items: [
          { name: 'Pixel Fries', sub: 'cut square. obviously.', price: '$9' },
          { name: '1-UP Dumplings', sub: 'six per life, chili crisp', price: '$12' },
          { name: 'Cheat Code Nachos', sub: 'unlimited cheese glitch enabled', price: '$14' },
          { name: 'Boss Rush Burger', sub: 'double patty, no saving', price: '$17' },
        ],
      },
    ],
  },
  footer: {
    addressHtml: '1987 Circuit Ave, Sector 7<br>Wed–Sun · 18:00–03:00 · 18+ after 21:00',
    gameOver: 'GAME OVER? NEVER.',
    creditHtml: 'A fictional arcade, original design by <a href="https://github.com/BrainwavePro">BrainwavePro</a>',
  },
  showcase: {
    chipLabel: '← Weft',
    chipHref: '/',
    footerHtml: 'Part of <a href="/">Weft</a> — 25 sites, 25 styles.',
  },
};
