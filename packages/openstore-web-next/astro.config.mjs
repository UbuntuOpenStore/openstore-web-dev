// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import preact from '@astrojs/preact';
import sentry from '@sentry/astro';
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import db from "@astrojs/db";
import sitemap from "@astrojs/sitemap";

// https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file
const { SITE, SENTRY_DSN, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: SITE ?? "https://open-store.io/",
  trailingSlash: "always",
  integrations: [
    preact({ compat: true }),
    sentry({
      dsn: SENTRY_DSN,
      sourceMapsUploadOptions: {
        project: SENTRY_PROJECT,
        authToken: SENTRY_AUTH_TOKEN,
      },
    }),
    db(),
    sitemap(),
  ],
  i18n: {
    locales: [
     "en-us",

      "ar",
      "be",
      "ca",
      "cs",
      "de",
      "el",
      "es",
      "fi",
      "fr",
      "gl",
      "he",
      "hu",
      "it",
      "lt",
      "nb-no",
      "nl",
      "pl",
      "pt-br",
      "pt-pt",
      "pt",
      "ru",
      "sc",
      "sk",
      "sv",
      "ta",
      "tr",
      "zh-hans",
      "zh-hant",
    ],
    defaultLocale: "en-us",
  },
  prefetch: {
    prefetchAll: false,
  },
  output: "static",
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    server: {
      allowedHosts: ["next.local.open-store.io", "next.open-store.io", "open-store.io"],
    },

    plugins: [tailwindcss()],
  },
});
