// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import preact from '@astrojs/preact';
import sentry from '@sentry/astro';
import { loadEnv } from "vite";

// https://docs.astro.build/en/guides/configuring-astro/#environment-variables
const { SITE, SENTRY_DSN, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: SITE ?? 'https://open-store.io/',
  integrations: [
    tailwind({applyBaseStyles: false}),
    preact({ compat: true }),
    sentry({
      dsn: SENTRY_DSN,
      sourceMapsUploadOptions: {
        project: SENTRY_PROJECT,
        authToken: SENTRY_AUTH_TOKEN,
      },
    }),
  ],
  output: "hybrid",
  adapter: node({
    mode: 'standalone'
  })
});
