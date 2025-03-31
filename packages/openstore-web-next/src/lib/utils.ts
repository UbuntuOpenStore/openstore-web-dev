import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
