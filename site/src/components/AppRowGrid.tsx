import { AppRow } from './AppRow'
import { PagerArrows } from './PagerControls'
import { useSnapScroll } from './useSnapScroll'
import type { Listing } from '../data/listings'

function Grid({ apps }: { apps: Listing[] }) {
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

export function AppRowGrid({ apps }: { apps: Listing[] }) {
  if (apps.length <= 9) {
    return <Grid apps={apps} />
  }

  const pages: Listing[][] = []
  for (let i = 0; i < apps.length; i += 9) {
    pages.push(apps.slice(i, i + 9))
  }

  return <PagedGrids pages={pages} />
}

function PagedGrids({ pages }: { pages: Listing[][] }) {
  const { ref, prev, next, onScroll } = useSnapScroll(pages.length)

  return (
    <div className="relative min-w-0">
      <div
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
      >
        {pages.map((page, i) => (
          <div key={i} className="w-full min-w-0 shrink-0 snap-center">
            <Grid apps={page} />
          </div>
        ))}
      </div>
      <PagerArrows onPrev={prev} onNext={next} />
    </div>
  )
}
