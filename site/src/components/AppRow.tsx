import { Link } from '@tanstack/react-router'
import { iconSrc } from '../lib/constants'
import type { Listing } from '../data/listings'

export function AppRow({ app }: { app: Listing }) {
  return (
    <Link
      to="/apps/$slug"
      params={{ slug: app.slug }}
      className="flex items-center gap-4 rounded-xl px-2 py-2 hover:bg-surface"
    >
      <img
        src={iconSrc(app.slug)}
        alt=""
        width={64}
        height={64}
        className="size-16 rounded-[22%] border border-border"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{app.name}</p>
        <p className="truncate text-sm text-text-muted">{app.tagline}</p>
      </div>
      <span className="shrink-0 rounded-full bg-surface-2 px-4 py-1.5 text-sm font-semibold text-accent">
        View
      </span>
    </Link>
  )
}
