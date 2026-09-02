import { Link } from '@tanstack/react-router'
import { categoryLabel, iconSrc, screenshotSrc } from '../lib/constants'
import { imageDimensions } from '../lib/images'
import { PagerArrows, PagerDots } from './PagerControls'
import { useSnapScroll } from './useSnapScroll'
import type { Listing } from '../data/listings'

export function HeroCarousel({ apps }: { apps: Listing[] }) {
  const slides = apps.filter((app) => app.screenshots[0])
  const { ref, index, goTo, prev, next, onScroll } = useSnapScroll(slides.length)
  const showControls = slides.length > 1

  if (slides.length === 0) return null

  return (
    <div className="min-w-0">
      <div className="relative min-w-0">
        <div
          ref={ref}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          role="region"
          aria-label="Featured apps"
        >
          {slides.map((app) => (
            <HeroCard key={app.slug} app={app} />
          ))}
        </div>
        {showControls ? <PagerArrows onPrev={prev} onNext={next} /> : null}
      </div>
      {showControls ? <PagerDots index={index} count={slides.length} onDot={goTo} /> : null}
    </div>
  )
}

function HeroCard({ app }: { app: Listing }) {
  const shot = app.screenshots[0]
  const { width, height } = imageDimensions(app.slug, shot.file)

  return (
    <Link
      to="/apps/$slug"
      params={{ slug: app.slug }}
      className="relative aspect-video max-h-[480px] w-full min-w-0 shrink-0 snap-center overflow-hidden rounded-2xl"
    >
      <img
        src={screenshotSrc(app.slug, shot.file)}
        alt=""
        width={width}
        height={height}
        className="absolute inset-0 h-full w-full max-w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute inset-0 flex min-w-0 flex-col justify-end p-6 md:p-10">
        <p className="text-xs tracking-wide text-white/80 uppercase">{categoryLabel(app.category)}</p>
        <h2 className="text-3xl font-bold text-white md:text-5xl">{app.name}</h2>
        <p className="mt-1 text-white/90">{app.tagline}</p>
        <div className="mt-4 flex min-w-0 items-center gap-3">
          <img
            src={iconSrc(app.slug)}
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-[22%] border border-white/20"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{app.name}</p>
            <p className="truncate text-xs text-white/80">{app.tagline}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
            View
          </span>
        </div>
      </div>
    </Link>
  )
}
