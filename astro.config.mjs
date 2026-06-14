// @ts-nocheck
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { samhitasSidebarGroup } from './src/data/samhitas-sidebar.mjs';

const rigvedaMandalaRedirects = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const mandala = index + 1;
    const folder = `Mandala_${String(mandala).padStart(2, '0')}`;
    return [
      [`/rigveda-samhita/${folder}`, `/rigveda-samhita/mandala-${mandala}/`],
      [`/rigveda-samhita/${folder}/`, `/rigveda-samhita/mandala-${mandala}/`],
      [`/iast/rigveda-samhita/${folder}`, `/iast/rigveda-samhita/mandala-${mandala}/`],
      [`/iast/rigveda-samhita/${folder}/`, `/iast/rigveda-samhita/mandala-${mandala}/`],
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
                      en: 'nitya karma​',
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
                      en: 'veda mantrāḥ',
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
                      en: 'saṃhitāḥ',
                  },
                  items: samhitasSidebarGroup.items,
              },
          ],
          customCss: ['./src/styles/global.css', './src/fonts/font-face.css'],
          head: [
            {
              tag: 'link',
              attrs: {
                rel: 'preload',
                href: '/fonts/siddhanta.woff2',
                as: 'font',
                type: 'font/woff2',
                crossorigin: 'anonymous',
              },
            },
          ],
      }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      tsconfigPaths: true,
    },
  },
});