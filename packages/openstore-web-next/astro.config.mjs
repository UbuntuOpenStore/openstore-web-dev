// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import preact from '@astrojs/preact';
import sentry from '@sentry/astro';
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import db from "@astrojs/db";
import sitemap from "@astrojs/sitemap";
import { i18n, filterSitemapByDefaultLocale } from "astro-i18n-aut/integration";
import localesJson from "./src/locales.json";

// https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file
const { SITE, SENTRY_DSN, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), "");

const defaultLocale = "en-us";
const locales = { "en-us": "en_US"};
for (const locale of localesJson) {
  // @ts-ignore
  locales[locale.slug] = locale.code;
}

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
    i18n({
      locales,
      defaultLocale,
      exclude: ["pages/api/**/*", "pages/manage/**/*"],
    }),
    sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
      filter: filterSitemapByDefaultLocale({ defaultLocale }),
    }),
  ],
  i18n: {
    locales: Object.keys(locales),
    defaultLocale,
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
