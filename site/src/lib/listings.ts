import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import featuredSlugs from '../data/featured.json';
const slugs: string[] = featuredSlugs;

export type AppEntry = CollectionEntry<'apps'>;

export async function allListings(): Promise<AppEntry[]> {
  const apps = await getCollection('apps');
  return apps.sort((a, b) => a.data.name.localeCompare(b.data.name));
}

export async function listingBySlug(slug: string) {
  return getEntry('apps', slug);
}

export async function featuredListings(): Promise<AppEntry[]> {
  const apps = await getCollection('apps');
  const byId = new Map(apps.map((app) => [app.id, app]));
  const featured: AppEntry[] = [];
  for (const slug of slugs) {
    const entry = byId.get(slug);
    if (!entry) {
      console.warn(`featured.json: unknown slug "${slug}" (ignored)`);
      continue;
    }
    featured.push(entry);
  }
  return featured;
}

export async function newestListings(limit = 12): Promise<AppEntry[]> {
  const apps = await getCollection('apps');
  return [...apps]
    .sort(
      (a, b) =>
        b.data.addedAt.localeCompare(a.data.addedAt) || a.data.name.localeCompare(b.data.name),
    )
    .slice(0, limit);
}

export async function listingsByCategory(category: string): Promise<AppEntry[]> {
  const apps = await getCollection('apps');
  return apps
    .filter((app) => app.data.category === category)
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
}

export async function categoryCounts(): Promise<{ category: string; count: number }[]> {
  const apps = await getCollection('apps');
  const counts = new Map<string, number>();
  for (const app of apps) {
    counts.set(app.data.category, (counts.get(app.data.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
}
