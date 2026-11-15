// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO(Luke): replace with the real domain at "ready to host" (used for canonical URLs, OG and the sitemap).
export default defineConfig({
  site: 'https://lukepetzer.example',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
