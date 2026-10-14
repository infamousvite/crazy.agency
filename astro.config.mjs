// @ts-check
import { defineConfig } from 'astro/config';

// DA CONFERMARE: dominio definitivo
export default defineConfig({
  site: 'https://www.crazyagency.it',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
