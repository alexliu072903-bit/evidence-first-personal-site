import { defineConfig } from 'astro/config';
import site from './src/site.config.mjs';

export default defineConfig({
  site: site.deployment.site,
  base: site.deployment.base,
  output: 'static',
  trailingSlash: 'always',
});
