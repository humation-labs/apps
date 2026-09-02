import { Link } from '@tanstack/react-router'
import { IconChevronRight } from '@tabler/icons-react'
import { iconSrc, screenshotSrc } from '../lib/constants'
import { categoryLabel, langParam, useLocale, useT } from '../i18n'
import { imageDimensions } from '../lib/images'
import { PagerArrows, PagerDots } from './PagerControls'
import { useSnapScroll } from './useSnapScroll'
import type { Listing } from '../data/listings'

export function HeroCarousel({ apps }: { apps: Listing[] }) {
  const slides = apps.filter((app) => app.screenshots[0])
  const { ref, index, goTo, prev, next, onScroll, atStart, atEnd } = useSnapScroll(slides.length)
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
        {showControls ? (
          <PagerArrows onPrev={prev} onNext={next} showPrev={!atStart} showNext={!atEnd} />
        ) : null}
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/5" />
      <div className="absolute inset-0 flex min-w-0 flex-col justify-end p-6 md:p-10">
        <div className="flex min-w-0 flex-col md:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <img
              src={iconSrc(app.slug)}
              alt=""
              width={56}
              height={56}
              className="size-14 rounded-[22%] ring-1 ring-inset ring-white/20"
            />
            <p className="text-[11px] font-semibold tracking-[0.08em] text-white/70 uppercase">
              {categoryLabel(app.category, t)}
            </p>
            <h2 className="line-clamp-2 min-w-0 text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
              {app.name}
            </h2>
            <p className="max-w-[36ch] text-base text-white/85 md:text-xl">{app.tagline}</p>
          </div>
          <span className="mt-4 inline-flex h-10 shrink-0 items-center self-start rounded-full bg-white px-5 text-sm leading-none font-semibold text-black md:mt-0 md:self-end">
            {t.home.view}
            <IconChevronRight size={16} stroke={2.5} className="-mr-1" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}
