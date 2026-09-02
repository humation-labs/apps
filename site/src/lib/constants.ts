export const ADD_APP_PROMPT =
  'Fetch https://apps.humation.app/llms.txt and follow the instructions to submit this app to apps.humation.app.';

export const CONTRIBUTING_URL =
  'https://github.com/humation-labs/apps.humation.app/blob/main/CONTRIBUTING.md';

export const SITE_NAME = 'Humation Apps';
export const SITE_ORIGIN = 'https://apps.humation.app';

/** Catalog is still small; keep the sidebar in the tree but do not render it. */
export const SIDEBAR_ENABLED = false;

export const RESERVED_SLUGS = [
  'apps',
  'app',
  'search',
  'category',
  'categories',
  'ja',
  'en',
  'schema',
  'llms.txt',
  'favicon.png',
  'assets',
  '404',
  'api',
  'static',
  'public',
  'sitemap.xml',
  'robots.txt',
  'index',
] as const;

export const CATEGORIES = [
  'social',
  'games',
  'productivity',
  'developer-tools',
  'education',
  'entertainment',
  'lifestyle',
  'business',
  'other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const PLATFORMS = [
  'web',
  'ios',
  'android',
  'macos',
  'windows',
  'linux',
  'cli',
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const PRICING = ['free', 'freemium', 'paid'] as const;

export type Pricing = (typeof PRICING)[number];

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function packageHref(pkg: string): string {
  if (pkg === 'humation-swift') return 'https://github.com/humation-labs/humation-swift';
  return `https://www.npmjs.com/package/${pkg}`;
}

export function iconSrc(slug: string): string {
  return `/apps/${slug}/icon.png`;
}

export function screenshotSrc(slug: string, file: string): string {
  return `/apps/${slug}/${file}`;
}

export function developerHref(developer: { url?: string; github: string }): string {
  return developer.url ?? `https://github.com/${developer.github}`;
}

export function descriptionParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function canonicalUrl(pathname: string): string {
  const url = new URL(pathname, SITE_ORIGIN);
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.href;
}
