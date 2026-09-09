import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Hidden case studies — kept out of the sitemap so crawlers don't get nudged
// toward URLs that already carry a page-level noindex.
const HIDDEN_SLUGS = [
  'greybrook-boardroom-brief',
  'saturnbird-marketing-plan',
  // Retired from the showcase: an argument with no shipped outcome, and a
  // document-production case whose substance now sits inside the AI stack.
  // Kept building so existing links resolve, but out of the lists and the
  // sitemap.
  'evolve-content-strategy',
  'evolve-production-automation',
];

// https://astro.build/config
export default defineConfig({
  site: 'https://justindoone.github.io',
  // Cases folded into a parent rather than deleted. Each was a component of a
  // story the parent now tells in full, so the old URL should land on that
  // parent instead of 404ing.
  redirects: {
    '/work/greybrook-inside-track-2025': '/work/greybrook-digital-strategy-2025',
    '/work/greybrook-investment-announcement': '/work/greybrook-digital-strategy-2025',
    '/work/cricket-park-campaign': '/work/roxborough-communities',
    '/work/minihotel-hk': '/work/eton-properties',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !HIDDEN_SLUGS.some((slug) => page.includes(`/work/${slug}`)) &&
        !page.includes('/faqs'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
