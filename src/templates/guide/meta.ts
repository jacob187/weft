import type { TemplateMeta } from '~/templates/types';

/** A long-form article template. `no: ''` keeps it out of the showcase grid; it is still a usable template. */
const meta: TemplateMeta = {
  slug: 'guide',
  no: '',
  name: 'THE GUIDE',
  summary: 'A dark long-form article page — numbered sections, callouts, code blocks and tables in a narrow reading column.',
  technique: 'LONG-FORM ARTICLE',
  swatch: ['#08080d', '#e8c168', '#7ce7d8'],
  fontsHref:
    'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap',
  favicon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%2308080d'/%3E%3Ctext x='16' y='22' text-anchor='middle' font-family='monospace' font-size='14' fill='%23e8c168'%3E%3F%3C/text%3E%3C/svg%3E",
  themeColor: '#08080d',
};

export default meta;
