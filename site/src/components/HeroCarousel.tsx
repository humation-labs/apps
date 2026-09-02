import { IconChevronRight } from '@tabler/icons-react'
import { iconSrc, screenshotSrc } from '../lib/constants'
import { categoryLabel, localePath, useLocale, useT } from '../i18n'
import { imageDimensions } from '../lib/images'
import type { Listing } from '../data/listings'
import { LocaleLink } from './LocaleLink'
import { PagerArrows, PagerDots } from './PagerControls'
import { useSnapScroll } from './useSnapScroll'

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
          {slides.map((app, slideIndex) => (
            <HeroCard key={app.slug} app={app} index={slideIndex} />
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

function HeroCard({ app, index }: { app: Listing; index: number }) {
  const locale = useLocale()
  const t = useT()
  const shot = app.screenshots[0]
  const { width, height } = imageDimensions(app.slug, shot.file)
  const isPortrait = height > width
  const src = screenshotSrc(app.slug, shot.file)
  const isLcp = index === 0
  const loading = isLcp ? 'eager' : 'lazy'
  const fetchPriority = isLcp ? 'high' : undefined

  return (
    <LocaleLink
      href={localePath(locale, `/${app.slug}`)}
      className={`relative isolate aspect-[4/5] w-full min-w-0 shrink-0 snap-center overflow-hidden rounded-xl md:aspect-[21/9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
        isPortrait
          ? ''
          : 'border border-border/70 dark:border-white/15 ring-1 ring-inset ring-black/10 dark:ring-white/10'
      }`}
    >
      {isPortrait ? (
        <img
          src={src}
          alt=""
          aria-hidden
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full max-w-full scale-110 object-cover object-center opacity-70 blur-2xl saturate-150"
        />
      ) : (
        <img
          src={src}
          alt=""
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full max-w-full object-cover object-top"
        />
      )}
      <span className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10" />
      <div
        className={`absolute inset-0 z-10 bg-gradient-to-t ${
          isPortrait
            ? 'from-black/95 via-black/60 to-black/20'
            : 'from-black/90 via-black/45 to-black/5'
        }`}
      />
      {isPortrait ? (
        <div className="absolute top-4 right-4 z-20 h-[58%] w-auto overflow-hidden rounded-xl border border-border/70 shadow-2xl dark:border-white/15 md:top-6 md:right-8 md:bottom-6 md:h-auto md:rounded-[1.25rem] lg:right-12">
          <img
            src={src}
            alt=""
            width={width}
            height={height}
            loading={loading}
            fetchPriority={fetchPriority}
            decoding="async"
            className="h-full w-auto object-contain"
          />
        </div>
      ) : null}
      <div className="absolute inset-0 z-30 flex min-w-0 flex-col justify-end p-6 md:p-10">
        <div className={`flex min-w-0 flex-col ${isPortrait ? '' : 'md:flex-row'}`}>
          <div
            className={`flex min-w-0 flex-1 flex-col ${isPortrait ? 'max-w-full md:max-w-[55%]' : ''}`}
          >
            <div className="flex min-w-0 flex-col gap-3">
              <img
                src={iconSrc(app.slug)}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="size-14 rounded-[22%] ring-1 ring-inset ring-white/20"
              />
              <p className="text-[11px] font-semibold tracking-[0.08em] text-white/70 uppercase">
                {categoryLabel(app.category, t)}
              </p>
              <h2 className="line-clamp-2 min-w-0 text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-4xl lg:text-6xl">
                {app.name}
              </h2>
              <p className="max-w-[36ch] text-base text-white/85 md:text-xl">{app.tagline}</p>
            </div>
            {isPortrait ? (
              <span className="mt-4 inline-flex h-10 shrink-0 items-center self-start rounded-full bg-white px-5 text-sm leading-none font-semibold text-black">
                {t.home.view}
                <IconChevronRight size={16} stroke={2.5} className="-mr-1" aria-hidden />
              </span>
            ) : null}
          </div>
          {isPortrait ? null : (
            <span className="mt-4 inline-flex h-10 shrink-0 items-center self-start rounded-full bg-white px-5 text-sm leading-none font-semibold text-black md:mt-0 md:self-end">
              {t.home.view}
              <IconChevronRight size={16} stroke={2.5} className="-mr-1" aria-hidden />
            </span>
          )}
        </div>
      </div>
    </LocaleLink>
  )
}
