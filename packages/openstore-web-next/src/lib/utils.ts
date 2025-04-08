import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getRelativeLocaleUrl as getRelativeLocaleUrlAstro } from "astro:i18n";
import localesJson from '../locales.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function categorySlug(category: string) {
  return category.toLowerCase().replace('& ', '').replace(/ /g, '-');
}

export function getClientApiKey() {
  const match = document.cookie.match(new RegExp('(^| )apikey=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : undefined;
}

// Specifically not putting these in the i18n module so the client doesn't need to load all the translation files
export function getRelativeLocaleUrl(locale: string | undefined, path: string) {
  return getRelativeLocaleUrlAstro(locale ?? 'en-us', path);
}

export function localeSlugToCode(locale = 'en-us') {
  const compare = locale.replaceAll('-', "_");
  const found = localesJson.find((l) => l.code.toLowerCase() === compare);
  if (!found) {
    throw new Error(`Unknown locale: ${locale}`);
  }

  return found.code;
}
