// @ts-nocheck
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://vaidhikadharma.org',

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
          },
          routeMiddleware: './src/route-middleware.ts',
          defaultLocale: 'root',
          locales: {
              root: {
                  label: 'IAST',
                  lang: 'en'
              },
              sa: {
                  label: 'देवनागरि',
                  lang: 'sa'
              }
          },
          sidebar: [
              {
                  label: 'Nithya Karma',
                  translations: {
                      sa: 'नित्यकर्म​',
                      ta: 'நித்ய கர்ம',
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
                  label: 'Veda Mantra',
                  translations: {
                      sa: 'वेद मन्त्रा:',
                      ta: 'வேத மந்த்ரா:',
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
  vite: { plugins: [tailwindcss()] },
});