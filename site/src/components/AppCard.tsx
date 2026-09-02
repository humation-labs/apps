import { Link } from '@tanstack/react-router'
import { iconSrc } from '../lib/constants'
import type { Listing } from '../data/listings'

export function AppCard({ app }: { app: Listing }) {
  return (
    <Link
      to="/apps/$slug"
      params={{ slug: app.slug }}
      className="flex gap-3 rounded-lg border border-zinc-200 p-4 hover:border-zinc-400 dark:border-zinc-800"
    >
      <img src={iconSrc(app.slug)} alt="" width={64} height={64} className="size-16 rounded-[24%]" />
      <div className="min-w-0">
        <h3 className="font-semibold">{app.name}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{app.tagline}</p>
      </div>
    </Link>
  )
}
