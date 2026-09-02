import featuredSlugsJson from './featured.json'
import type { Category, Platform } from '../lib/constants'

const featuredSlugs: string[] = featuredSlugsJson

const files = import.meta.glob('../../../apps/*/app.json', {
  eager: true,
  import: 'default',
}) as Record<string, AppJson>

export type HumationPackage =
  | '@humation/react'
  | '@humation/core'
  | '@humation/web-component'
  | '@humation/assets-humation-1'
  | 'humation-swift'

export type Pricing = 'free' | 'freemium' | 'paid'

export type Listing = {
  slug: string
  $schema?: string
  name: string
  tagline: string
  description: string
  url: string
  category: Category
  platforms: Platform[]
  pricing: Pricing
  humation: {
    packages: HumationPackage[]
    usage?: string
  }
  developer: {
    name: string
    github: string
    url?: string
  }
  icon: 'icon.png'
  screenshots: { file: string; alt: string }[]
  links?: {
    repo?: string
    appStore?: string
    playStore?: string
    x?: string
    discord?: string
  }
  addedAt: string
}

type AppJson = Omit<Listing, 'slug'>

function slugFromPath(path: string): string {
  const match = path.match(/\/apps\/([^/]+)\/app\.json$/)
  if (!match) {
    throw new Error(`Cannot parse listing slug from ${path}`)
  }
  return match[1]
}

const listings: Listing[] = Object.entries(files).map(([path, data]) => ({
  slug: slugFromPath(path),
  ...data,
}))

export function allListings(): Listing[] {
  return [...listings].sort((a, b) => a.name.localeCompare(b.name))
}

export function bySlug(slug: string): Listing | undefined {
  return listings.find((app) => app.slug === slug)
}

export function byCategory(category: string): Listing[] {
  return listings
    .filter((app) => app.category === category)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function newest(limit = 12): Listing[] {
  return [...listings]
    .sort(
      (a, b) => b.addedAt.localeCompare(a.addedAt) || a.name.localeCompare(b.name),
    )
    .slice(0, limit)
}

export function featured(): Listing[] {
  const byId = new Map(listings.map((app) => [app.slug, app]))
  const out: Listing[] = []
  for (const slug of featuredSlugs) {
    const entry = byId.get(slug)
    if (!entry) {
      console.warn(`featured.json: unknown slug "${slug}" (ignored)`)
      continue
    }
    out.push(entry)
  }
  return out
}

export function categoryCounts(): { category: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const app of listings) {
    counts.set(app.category, (counts.get(app.category) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category))
}
