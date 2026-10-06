import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import site from './src/site.config.mjs';

export default defineConfig({
  site: site.deployment.site,
  base: site.deployment.base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
});
