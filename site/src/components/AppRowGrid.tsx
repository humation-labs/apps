import { AppRow } from './AppRow'
import type { Listing } from '../data/listings'

export function AppRowGrid({ apps }: { apps: Listing[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
      {apps.map((app) => (
        <div key={app.slug} className="min-w-0">
          <AppRow app={app} />
        </div>
      ))}
    </div>
  )
}
