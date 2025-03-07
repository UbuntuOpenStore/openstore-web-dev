// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import preact from '@astrojs/preact';
import sentry from '@sentry/astro';
import { loadEnv } from "vite";

// https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file
const { SITE, SENTRY_DSN, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: SITE ?? "https://open-store.io/",
  integrations: [
    tailwind({ applyBaseStyles: false }),
    preact({ compat: true }),
    sentry({
      dsn: SENTRY_DSN,
      sourceMapsUploadOptions: {
        project: SENTRY_PROJECT,
        authToken: SENTRY_AUTH_TOKEN,
      },
    }),
  ],
  output: "static",
  adapter: node({
    mode: "standalone",
  }),
  experimental: {
    session: true,
  },
  vite: {
    server: {
      allowedHosts: ["next.local.open-store.io", "next.open-store.io", "open-store.io"],
    },
  },
});
