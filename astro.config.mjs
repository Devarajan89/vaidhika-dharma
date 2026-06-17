// @ts-nocheck
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { samhitasSidebarGroup, brahmanamSidebarGroup, upanishadsSidebarGroup } from './src/data/samhitas-sidebar.mjs';

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

export default defineConfig({
  site: 'https://vaidhikadharma.org',

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  redirects: {
    ...rigvedaMandalaRedirects,
    '/aswalayana-sandhyavandanam': '/aswalayana-sandhyavandanam/prata',
    '/apastamba-sandhyavandanam': '/apastamba-sandhyavandanam/prata',
    '/iast/aswalayana-sandhyavandanam': '/iast/aswalayana-sandhyavandanam/prata',
    '/iast/apastamba-sandhyavandanam': '/iast/apastamba-sandhyavandanam/prata',
    '/upanishads/isha-upanishad': '/kanva-samhita/chapter-40',
    '/iast/upanishads/isha-upanishad': '/iast/kanva-samhita/chapter-40',
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
                  label: 'उपनिषदः',
                  translations: {
                      en: 'Upaniṣadaḥ',
                  },
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
  },
});