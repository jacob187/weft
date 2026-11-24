import type { TemplateMeta } from '~/templates/types';

/** The hub/gallery itself. `no: ''` keeps it out of the showcase grid; it is still a usable template. */
const meta: TemplateMeta = {
  slug: 'gallery',
  no: '',
  name: 'GALLERY',
  summary: 'A dark portfolio index — woven palette threads behind a grid of swatch cards.',
  technique: 'WOVEN CANVAS',
  tags: ['portfolio', 'index', 'collection', 'dark', 'grid', 'showcase'],
  bestFor: ['portfolios', 'product catalogs', 'link hubs'],
  swatch: ['#08080d', '#e8c168', '#ecebe6'],
  fontsHref:
    'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400&display=swap',
  favicon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%2308080d'/%3E%3Ctext x='16' y='23' text-anchor='middle' font-family='serif' font-style='italic' font-size='19' fill='%23e8c168'%3E25%3C/text%3E%3C/svg%3E",
  themeColor: '#08080d',
};

export default meta;
