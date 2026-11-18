import type { TemplateMeta } from '~/templates/types';

const meta: TemplateMeta = {
  slug: 'arcade',
  no: '05',
  name: 'NEON DISTRICT',
  summary: 'A synthwave arcade bar: CRT scanlines, perspective grid floor, and box-shadow pixel sprites.',
  technique: 'CANVAS + CRT',
  swatch: ['#0d0518', '#ff3ec8', '#38e8ff'],
  fontsHref:
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;600;800&family=Chakra+Petch:wght@300;400;600&display=swap',
  favicon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230d0518'/%3E%3Ccircle cx='16' cy='14' r='8' fill='none' stroke='%23ff3ec8' stroke-width='2'/%3E%3Cpath d='M4 28 L16 20 L28 28' stroke='%2338e8ff' stroke-width='2' fill='none'/%3E%3C/svg%3E",
  themeColor: '#0d0518',
};

export default meta;
