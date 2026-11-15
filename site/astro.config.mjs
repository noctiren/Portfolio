// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// M5: replace with the <name>.pages.dev URL at "ready to host" (Q16) (used for canonical URLs, OG and the sitemap).
export default defineConfig({
  site: 'https://lukepetzer.example',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
