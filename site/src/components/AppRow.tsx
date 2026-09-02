import { Link } from '@tanstack/react-router'
import { iconSrc } from '../lib/constants'
import { langParam, useLocale, useT } from '../i18n'
import type { Listing } from '../data/listings'

export function AppRow({ app }: { app: Listing }) {
  const locale = useLocale()
  const t = useT()

  return (
    <Link
      to="/{-$lang}/apps/$slug"
      params={{ lang: langParam(locale), slug: app.slug }}
      className="-mx-2 flex items-center gap-4 rounded-lg px-2 py-2 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <img
        src={iconSrc(app.slug)}
        alt=""
        width={64}
        height={64}
        className="size-16 shrink-0 rounded-[24%] ring-1 ring-inset ring-black/10 dark:ring-white/10"
      />
      <div className="min-w-0 flex-1 self-center">
        <p className="truncate text-[14px]/5 font-medium">{app.name}</p>
        <p className="truncate text-[13px]/[18px] text-text-muted">{app.tagline}</p>
      </div>
      <span className="inline-flex h-7 shrink-0 items-center justify-center rounded-full bg-surface-2 px-3.5 text-[13px] leading-none font-semibold text-accent">
        {t.home.view}
      </span>
    </Link>
  )
}
