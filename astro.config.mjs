// @ts-nocheck
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://vaidhikadharma.org',

  redirects: {
    '/aswalayana-sandhyavandanam': '/aswalayana-sandhyavandanam/prata',
    '/apastamba-sandhyavandanam': '/apastamba-sandhyavandanam/prata',
    '/iast/aswalayana-sandhyavandanam': '/iast/aswalayana-sandhyavandanam/prata',
    '/iast/apastamba-sandhyavandanam': '/iast/apastamba-sandhyavandanam/prata',
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
          ],
          customCss: ['./src/styles/global.css', './src/fonts/font-face.css'],
      }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      tsconfigPaths: true,
    },
  },
});