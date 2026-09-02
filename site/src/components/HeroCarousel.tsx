import { Link } from '@tanstack/react-router'
import { iconSrc, screenshotSrc } from '../lib/constants'
import { categoryLabel, langParam, useLocale, useT } from '../i18n'
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
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain touch-pan-x"
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
  const locale = useLocale()
  const t = useT()
  const shot = app.screenshots[0]
  const { width, height } = imageDimensions(app.slug, shot.file)

  return (
    <Link
      to="/{-$lang}/apps/$slug"
      params={{ lang: langParam(locale), slug: app.slug }}
      className="relative aspect-[4/5] w-full min-w-0 shrink-0 snap-center overflow-hidden rounded-xl md:aspect-video md:max-h-[480px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <img
        src={screenshotSrc(app.slug, shot.file)}
        alt=""
        width={width}
        height={height}
        className="absolute inset-0 h-full w-full max-w-full object-cover object-top"
      />
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
      <div className="absolute inset-0 flex min-w-0 flex-col justify-end p-6 drop-shadow md:p-10">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-white/80 uppercase">
          {categoryLabel(app.category, t)}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow md:text-5xl">{app.name}</h2>
        <p className="mt-1 text-white/90 drop-shadow">{app.tagline}</p>
        <div className="mt-4 flex min-w-0 items-center gap-3">
          <img
            src={iconSrc(app.slug)}
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-[24%] ring-1 ring-inset ring-white/20"
          />
          <div className="min-w-0 flex-1 self-center">
            <p className="truncate text-[14px]/5 font-medium text-white">{app.name}</p>
            <p className="truncate text-[13px]/[18px] text-white/80">{app.tagline}</p>
          </div>
          <span className="inline-flex h-7 shrink-0 items-center justify-center rounded-full bg-white/20 px-3.5 text-[13px] leading-none font-semibold text-white backdrop-blur">
            {t.home.view}
          </span>
        </div>
      </div>
    </Link>
  )
}
