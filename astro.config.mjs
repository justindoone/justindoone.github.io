import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Hidden case studies — kept out of the sitemap so crawlers don't get nudged
// toward URLs that already carry a page-level noindex.
const HIDDEN_SLUGS = [
  'evolve-worldcup-billboard',
  'greybrook-boardroom-brief',
  'minihotel-hk',
  'saturnbird-marketing-plan',
];

// https://astro.build/config
export default defineConfig({
  site: 'https://justindoone.github.io',
  integrations: [
    sitemap({
      filter: (page) =>
        !HIDDEN_SLUGS.some((slug) => page.includes(`/work/${slug}`)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
