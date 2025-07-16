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
  const url = getRelativeLocaleUrlAstro(locale ?? 'en-us', path);

  if (url.includes('#') && url.endsWith('/')) {
    // If the URL ends with a slash and has a hash, we need to remove the trailing slash
    // to prevent issues with the hash not being recognized correctly.
    return url.slice(0, -1);
  }

  return url;
}

export function removeLocaleFromPath(path: string) {
  for (const locale of localesJson) {
    path = path.replace(`/${locale.slug}/`, '');
  }

  return path;
}

export function localeSlugToCode(locale = 'en-us') {
  const compare = locale.replaceAll('-', "_");
  const found = localesJson.find((l) => l.code.toLowerCase() === compare);
  if (!found) {
    throw new Error(`Unknown locale: ${locale}`);
  }

  return found.code;
}
