// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://open-store.io/', // TODO local env & use this to query the api
  integrations: [tailwind({applyBaseStyles: false}), preact({ compat: true })],
  output: "hybrid",
  adapter: node({
    mode: 'standalone'
  })
});
