// @ts-nocheck
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import {
	samhitasSidebarGroup,
	brahmanamSidebarGroup,
	aranyakamSidebarGroup,
	upanishadsSidebarGroup,
} from './src/data/samhitas-sidebar.mjs';
import { chapterToKandaPrapathaka, TAITTIRIYA_TOTAL_PRAPATHAKAS } from './scripts/lib/taittiriya-samhita-structure.mjs';
import { MAITRAYANI_TOTAL_PRAPATHAKAS, chapterToKandaPrapathaka as maitrayaniChapterToKandaPrapathaka } from './scripts/lib/maitrayani-samhita-structure.mjs';
import { AITAREYA_PANCHIKAS } from './scripts/lib/aitareya-brahmana-structure.mjs';

const rigvedaMandalaRedirects = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const mandala = index + 1;
    const folder = `Mandala_${String(mandala).padStart(2, '0')}`;
    return [
      [`/rigveda-samhita/${folder}`, `/rigveda-samhita/mandala-${mandala}/`],
      [`/iast/rigveda-samhita/${folder}`, `/iast/rigveda-samhita/mandala-${mandala}/`],
    ];
  }).flat(),
);

const taittiriyaChapterRedirects = Object.fromEntries(
  Array.from({ length: TAITTIRIYA_TOTAL_PRAPATHAKAS }, (_, index) => {
    const chapter = index + 1;
    const { kanda, prapathaka } = chapterToKandaPrapathaka(chapter);
    const chapterSlug = `chapter-${String(chapter).padStart(2, '0')}`;
    const target = `/taittiriya-samhita/kanda-${kanda}/prapathaka-${prapathaka}/`;
    const iastTarget = `/iast/taittiriya-samhita/kanda-${kanda}/prapathaka-${prapathaka}/`;
    return [
      [`/taittiriya-samhita/${chapterSlug}`, target],
      [`/iast/taittiriya-samhita/${chapterSlug}`, iastTarget],
    ];
  }).flat(),
);

const taittiriyaKandaRedirects = Object.fromEntries(
  Array.from({ length: 7 }, (_, index) => {
    const kanda = index + 1;
    const padded = `kanda-${String(kanda).padStart(2, '0')}`;
    return [
      [`/taittiriya-samhita/${padded}`, `/taittiriya-samhita/kanda-${kanda}/`],
      [`/iast/taittiriya-samhita/${padded}`, `/iast/taittiriya-samhita/kanda-${kanda}/`],
    ];
  }).flat(),
);

const maitrayaniChapterRedirects = Object.fromEntries(
  Array.from({ length: MAITRAYANI_TOTAL_PRAPATHAKAS }, (_, index) => {
    const chapter = index + 1;
    const { kanda, prapathaka } = maitrayaniChapterToKandaPrapathaka(chapter);
    const chapterSlug = `chapter-${String(chapter).padStart(2, '0')}`;
    const target = `/maitrayani-samhita/kanda-${kanda}/prapathaka-${prapathaka}/`;
    const iastTarget = `/iast/maitrayani-samhita/kanda-${kanda}/prapathaka-${prapathaka}/`;
    return [
      [`/maitrayani-samhita/${chapterSlug}`, target],
      [`/iast/maitrayani-samhita/${chapterSlug}`, iastTarget],
    ];
  }).flat(),
);

const maitrayaniKandaRedirects = Object.fromEntries(
  Array.from({ length: 4 }, (_, index) => {
    const kanda = index + 1;
    const padded = `kanda-${String(kanda).padStart(2, '0')}`;
    return [
      [`/maitrayani-samhita/${padded}`, `/maitrayani-samhita/kanda-${kanda}/`],
      [`/iast/maitrayani-samhita/${padded}`, `/iast/maitrayani-samhita/kanda-${kanda}/`],
    ];
  }).flat(),
);

const aitareyaAstakaRedirects = Object.fromEntries(
  AITAREYA_PANCHIKAS.flatMap((panchikaInfo) => {
    const panchika = panchikaInfo.panchika;
    const adhyayaRedirects = Array.from({ length: panchikaInfo.adhyayaCount }, (_, index) => {
      const adhyaya = index + 1;
      return [
        [`/aitareya-brahmana/astaka-${panchika}/adhyaya-${adhyaya}`, `/aitareya-brahmana/panchika-${panchika}/adhyaya-${adhyaya}/`],
        [`/iast/aitareya-brahmana/astaka-${panchika}/adhyaya-${adhyaya}`, `/iast/aitareya-brahmana/panchika-${panchika}/adhyaya-${adhyaya}/`],
      ];
    }).flat();
    return [
      [`/aitareya-brahmana/astaka-${panchika}`, `/aitareya-brahmana/panchika-${panchika}/`],
      [`/iast/aitareya-brahmana/astaka-${panchika}`, `/iast/aitareya-brahmana/panchika-${panchika}/`],
      ...adhyayaRedirects,
    ];
  }),
);

export default defineConfig({
  site: 'https://vaidhikadharma.org',
  trailingSlash: 'always',

  prefetch: {
    defaultStrategy: 'hover',
  },

  build: {
    inlineStylesheets: 'always',
  },

  redirects: {
    ...rigvedaMandalaRedirects,
    ...taittiriyaChapterRedirects,
    ...taittiriyaKandaRedirects,
    ...maitrayaniChapterRedirects,
    ...maitrayaniKandaRedirects,
    ...aitareyaAstakaRedirects,
    '/aswalayana-sandhyavandanam': '/aswalayana-sandhyavandanam/prata',
    '/apastamba-sandhyavandanam': '/apastamba-sandhyavandanam/prata',
    '/iast/aswalayana-sandhyavandanam': '/iast/aswalayana-sandhyavandanam/prata',
    '/iast/apastamba-sandhyavandanam': '/iast/apastamba-sandhyavandanam/prata',
    '/upanishads/isha-upanishad': '/isha-upanishad',
    '/iast/upanishads/isha-upanishad': '/iast/isha-upanishad',
    '/upanishads/kena-upanishad': '/kena-upanishad',
    '/iast/upanishads/kena-upanishad': '/iast/kena-upanishad',
    '/upanishads/katha-upanishad': '/katha-upanishad',
    '/iast/upanishads/katha-upanishad': '/iast/katha-upanishad',
    '/upanishads/taittiriya-upanishad': '/taittiriya-upanishad',
    '/iast/upanishads/taittiriya-upanishad': '/iast/taittiriya-upanishad',
    '/upanishads/mahanarayana-upanishad': '/mahanarayana-upanishad',
    '/iast/upanishads/mahanarayana-upanishad': '/iast/mahanarayana-upanishad',
    '/upanishads/aitareya-upanishad': '/aitareya-upanishad',
    '/iast/upanishads/aitareya-upanishad': '/iast/aitareya-upanishad',
  },

  integrations: [
      starlight({
          title: 'Vaidhika Dharma',
          description:
              'Vedic mantras with svara, Rigveda and Yajurveda saṃhitās, nityakarma rituals, and Ṛgveda sūkta saṅgraha — Vaidhika Dharma.',
          favicon: '/images/favicon.svg',
          logo: {
              light: './src/assets/logo-light.svg',
              dark: './src/assets/logo-dark.svg'
          },
          social: [
              {
                  icon: 'facebook',
                  label: 'Facebook',
                  href: '/'
              }
          ],
          components: {
              Head: './src/components/Head.astro',
              Hero: './src/components/Hero.astro',
              Sidebar: './src/components/Sidebar.astro',
              LastUpdated: './src/components/LastUpdated.astro',
              PageTitle: './src/components/PageTitle.astro',
              Footer: './src/components/Footer.astro',
              Search: './src/components/Search.astro',
          },
          routeMiddleware: './src/route-middleware.ts',
          defaultLocale: 'root',
          locales: {
              root: {
                  label: 'देवनागरी',
                  lang: 'sa'
              },
              iast: {
                  label: 'IAST',
                  lang: 'en'
              }
          },
          sidebar: [
              {
                  label: 'नित्य कर्म​',
                  translations: {
                      en: 'Nityakarma',
                  },
                  items: [
                      {
                          autogenerate: {
                              directory: 'nityakarma',
                              collapsed: true,
                          },
                      },
                  ],
              },
              {
                  label: 'वेद मन्त्राः',
                  translations: {
                      en: 'Veda mantrāḥ',
                  },
                  items: [
                      {
                          autogenerate: {
                              directory: 'vedamantras',
                          },
                      },
                  ],
              },
              {
                  label: 'संहिताः',
                  translations: {
                      en: 'Saṃhitāḥ',
                  },
                  items: samhitasSidebarGroup.items,
              },
              {
                  label: 'ब्राह्मणाः',
                  translations: {
                      en: 'Brāhmaṇāḥ',
                  },
                  items: brahmanamSidebarGroup.items,
              },
              {
                  label: 'आरण्यकानि',
                  translations: {
                      en: 'Āraṇyakāni',
                  },
                  items: aranyakamSidebarGroup.items,
              },
              {
                  label: 'उपनिषदः',
                  translations: {
                      en: 'Upaniṣadaḥ',
                  },
                  collapsed: false,
                  items: upanishadsSidebarGroup.items,
              },
          ],
          customCss: ['./src/styles/global.css', './src/fonts/font-face.css'],
          head: [
            {
              tag: 'link',
              attrs: {
                rel: 'preload',
                href: '/fonts/siddhanta.ttf',
                as: 'font',
                type: 'font/ttf',
                crossorigin: 'anonymous',
              },
            },
          ],
      }),
      sitemap({
          filter: (page) => !page.includes('/404'),
      }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      tsconfigPaths: true,
    },
    build: {
      modulePreload: false,
    },
  },
});