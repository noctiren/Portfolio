// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Live address (M5, Luke 2026-11-15): used for canonical URLs, OG and the sitemap.
export default defineConfig({
  site: 'https://lukepetzer.pages.dev',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
