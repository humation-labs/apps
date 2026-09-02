import { AddAppButton } from '../components/AddAppButton'
import { AppRowGrid } from '../components/AppRowGrid'
import { CategoryIcon } from '../components/CategoryIcon'
import { FeaturedCards } from '../components/FeaturedCards'
import { LocaleLink } from '../components/LocaleLink'
import { Section } from '../components/Section'
import { byCategory, categoryCounts, featured, newest } from '../data/listings'
import type { Listing } from '../data/listings'
import { categoryLabel, getDict, localePath, useLocale, useT, type Locale } from '../i18n'
import { ADD_APP_PROMPT, CONTRIBUTING_URL } from '../lib/constants'
import { pageHead } from '../lib/head'
import { usePageData } from './usePageData'

type HomeData = {
  featured: Listing[]
  newest: Listing[]
  categories: { category: string; count: number; apps: Listing[] }[]
}

export function homeRoute(locale: Locale) {
  return {
    loader: (): HomeData => ({
      featured: featured(),
      newest: newest(18),
      categories: categoryCounts().map(({ category, count }) => ({
        category,
        count,
        apps: byCategory(category).slice(0, 9),
      })),
    }),
    head: () => {
      const t = getDict(locale)
      return pageHead({
        title: t.meta.siteName,
        description: t.home.metaDescription,
        path: localePath(locale, '/'),
        locale,
      })
    },
    component: Home,
  }
}

function Home() {
  const { featured: featuredApps, newest: newestApps, categories } = usePageData<HomeData>()
  const locale = useLocale()
  const t = useT()

  return (
    <div className="min-w-0">
      <h1 className="text-4xl/tight font-bold tracking-tight">{t.home.title}</h1>

      {categories.length > 0 ? (
        <div className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain touch-pan-x">
          {categories.map(({ category }) => (
            <LocaleLink
              key={category}
              href={localePath(locale, `/category/${category}`)}
              className="inline-flex h-8 shrink-0 snap-start items-center gap-2 rounded-full bg-surface-2 px-3 text-[13px] font-medium hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <CategoryIcon category={category} size={16} className="icon-align -ml-0.5" />
              {categoryLabel(category, t)}
            </LocaleLink>
          ))}
        </div>
      ) : null}

      {featuredApps.length > 0 ? (
        <div className="mt-6 min-w-0">
          <FeaturedCards apps={featuredApps} />
        </div>
      ) : null}

      <Section title={t.home.new} subtitle={t.home.recentlyAdded} href={localePath(locale, '/')}>
        {newestApps.length === 0 ? (
          <p className="text-text-muted">{t.home.noListings}</p>
        ) : (
          <AppRowGrid apps={newestApps} />
        )}
      </Section>

      {categories.map(({ category, apps }) => (
        <Section
          key={category}
          title={categoryLabel(category, t)}
          href={localePath(locale, `/category/${category}`)}
        >
          <AppRowGrid apps={apps} />
        </Section>
      ))}

      <section className="mt-12 rounded-xl bg-surface p-6" aria-label={t.shell.addYourApp}>
        <h2 className="text-xl font-semibold tracking-tight">{t.home.ctaHeading}</h2>
        <p className="mt-2 text-[14px] text-text-muted">{t.home.ctaBody}</p>
        <div className="mt-4 flex min-w-0 items-start gap-2">
          <code className="block min-w-0 flex-1 font-mono text-[13px] leading-relaxed break-words rounded-sm bg-surface-2 p-3">
            {ADD_APP_PROMPT}
          </code>
          <AddAppButton
            label={t.shell.copy}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent px-4 text-[14px] leading-none font-semibold text-white"
          />
        </div>
        <p className="mt-3 text-sm text-text-muted">
          <a
            href={CONTRIBUTING_URL}
            className="hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {t.home.orReadContributing}
          </a>
        </p>
      </section>
    </div>
  )
}
