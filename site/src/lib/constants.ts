export const ADD_APP_PROMPT =
  'Fetch https://apps.humation.app/llms.txt and follow the instructions to submit this app to apps.humation.app.';

export const CONTRIBUTING_URL =
  'https://github.com/humation-labs/apps/blob/main/CONTRIBUTING.md';

export const SITE_NAME = 'Humation Apps';
export const SITE_ORIGIN = 'https://apps.humation.app';

export const CATEGORY_LABELS = {
  social: 'Social',
  games: 'Games',
  productivity: 'Productivity',
  'developer-tools': 'Developer Tools',
  education: 'Education',
  entertainment: 'Entertainment',
  lifestyle: 'Lifestyle',
  business: 'Business',
  other: 'Other',
} as const;

export type Category = keyof typeof CATEGORY_LABELS;

export const PLATFORM_LABELS = {
  web: 'Web',
  ios: 'iOS',
  android: 'Android',
  macos: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
  cli: 'CLI',
} as const;

export type Platform = keyof typeof PLATFORM_LABELS;

export const PRICING_LABELS = {
  free: 'Free',
  freemium: 'Freemium',
  paid: 'Paid',
} as const;

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category as Category] ?? category;
}

export function platformLabel(platform: string): string {
  return PLATFORM_LABELS[platform as Platform] ?? platform;
}

export function packageHref(pkg: string): string {
  if (pkg === 'humation-swift') return 'https://github.com/humation-labs/humation-swift';
  return 'https://github.com/humation-labs/humation';
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

export function formatAdded(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
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
