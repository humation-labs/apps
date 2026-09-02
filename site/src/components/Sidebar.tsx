import { useEffect, useState, type ReactNode } from 'react'
import {
  IconApps,
  IconArrowUpRight,
  IconBrandGithub,
  IconCheck,
  IconLanguage,
  IconLayoutSidebar,
  IconPlus,
  IconSearch,
  IconStar,
  IconUserCircle,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { ADD_APP_PROMPT } from '../lib/constants'
import { formatStars, githubStars } from '../lib/github'
import {
  LOCALE_NATIVE_NAME,
  categoryLabel,
  langParam,
  otherLocale,
  useLocale,
  useSwitchLocaleHref,
  useT,
} from '../i18n'
import { CopyButton } from './AddAppButton'
import { CategoryIcon } from './CategoryIcon'

const COLLAPSED_KEY = 'sidebar-collapsed'

const ghostButtonClass =
  'inline-flex size-7 items-center justify-center rounded-md text-text hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar'

function rowClassName(collapsed: boolean) {
  return collapsed
    ? 'flex size-8 items-center justify-center rounded-md text-[13px] font-medium text-text hover:bg-surface-3/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar'
    : 'flex h-8 w-full items-center gap-3 rounded-md px-2 text-[13px] font-medium text-text hover:bg-surface-3/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar'
}

function RowIcon({ children }: { children: ReactNode }) {
  return (
    <span className="icon-align inline-flex size-4 shrink-0 items-center justify-center">{children}</span>
  )
}

type LangParam = { lang: 'ja' | undefined }

function SidebarRow({
  collapsed,
  icon,
  label,
  to,
  params,
  href,
  exact,
  title: titleOverride,
  trailing,
}: {
  collapsed: boolean
  icon: ReactNode
  label: string
  title?: string
  trailing?: ReactNode
} & (
  | { to: '/{-$lang}'; params: LangParam; href?: undefined; exact?: boolean }
  | { to: '/{-$lang}/search'; params: LangParam; href?: undefined; exact?: undefined }
  | {
      to: '/{-$lang}/category/$category'
      params: LangParam & { category: string }
      href?: undefined
      exact?: undefined
    }
  | { href: string; to?: undefined; params?: undefined; exact?: undefined }
)) {
  const className = rowClassName(collapsed)
  const title = titleOverride ?? (collapsed ? label : undefined)
  const ariaLabel = collapsed ? (titleOverride ?? label) : undefined
  const inner = (
    <>
      <RowIcon>{icon}</RowIcon>
      {collapsed ? null : <span className="truncate">{label}</span>}
      {collapsed ? null : trailing}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        rel="noopener"
        target="_blank"
        className={className}
        title={title}
        aria-label={ariaLabel}
      >
        {inner}
      </a>
    )
  }

  if (to === '/{-$lang}/category/$category') {
    return (
      <Link
        to="/{-$lang}/category/$category"
        params={params}
        className={className}
        title={title}
        aria-label={ariaLabel}
        activeProps={{ className: 'bg-surface-2 text-text' }}
      >
        {inner}
      </Link>
    )
  }

  if (to === '/{-$lang}/search') {
    return (
      <Link
        to="/{-$lang}/search"
        params={params}
        className={className}
        title={title}
        aria-label={ariaLabel}
      >
        {inner}
      </Link>
    )
  }

  return (
    <Link
      to="/{-$lang}"
      params={params}
      activeOptions={exact ? { exact: true } : undefined}
      activeProps={{ className: 'bg-surface-2 text-text' }}
      className={className}
      title={title}
      aria-label={ariaLabel}
    >
      {inner}
    </Link>
  )
}

function Wordmark() {
  return (
    <>
      <img
        src="/logo_humation.svg"
        alt="Humation"
        width={102}
        height={16}
        className="h-3.5 w-auto dark:hidden"
      />
      <img
        src="/logo_humation_dk.svg"
        alt=""
        width={102}
        height={16}
        className="hidden h-3.5 w-auto dark:block"
      />
    </>
  )
}

export function Sidebar({ categories }: { categories: { category: string; count: number }[] }) {
  const [collapsed, setCollapsed] = useState(false)
  const stars = githubStars()
  const locale = useLocale()
  const t = useT()
  const lang = langParam(locale)
  const other = otherLocale(locale)
  const switchHref = useSwitchLocaleHref()

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === 'true')
    } catch {
      // Ignore storage access errors (private mode, SSR).
    }
  }, [])

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next))
      } catch {
        // Ignore storage access errors.
      }
      return next
    })
  }

  return (
    <aside
      className={`sticky top-0 hidden h-dvh shrink-0 flex-col overflow-y-auto border-r border-border bg-sidebar p-2 transition-[width] duration-150 lg:flex ${collapsed ? 'w-12' : 'w-[200px]'}`}
    >
      <div
        className={
          collapsed
            ? 'flex h-10 shrink-0 items-center justify-center'
            : 'flex h-10 shrink-0 items-center justify-between gap-1 pl-2'
        }
      >
        {collapsed ? (
          <button
            type="button"
            className={ghostButtonClass}
            aria-label={t.shell.expandSidebar}
            aria-expanded={false}
            onClick={toggleCollapsed}
          >
            <IconLayoutSidebar size={16} stroke={1.75} aria-hidden />
          </button>
        ) : (
          <>
            <Link to="/{-$lang}" params={{ lang }} className="flex min-w-0 items-center">
              <Wordmark />
            </Link>
            <div className="flex shrink-0 items-center">
              <Link
                to="/{-$lang}/search"
                params={{ lang }}
                aria-label={t.shell.search}
                className={ghostButtonClass}
              >
                <IconSearch size={16} stroke={1.75} aria-hidden />
              </Link>
              <button
                type="button"
                className={ghostButtonClass}
                aria-label={t.shell.collapseSidebar}
                aria-expanded={true}
                onClick={toggleCollapsed}
              >
                <IconLayoutSidebar size={16} stroke={1.75} aria-hidden />
              </button>
            </div>
          </>
        )}
      </div>

      <nav className="flex min-h-0 flex-1 flex-col" aria-label="Primary">
        <div className="flex flex-col gap-0.5">
          {collapsed ? (
            <SidebarRow
              collapsed
              to="/{-$lang}/search"
              params={{ lang }}
              label={t.shell.search}
              icon={<IconSearch size={16} stroke={1.75} aria-hidden />}
            />
          ) : null}
          <SidebarRow
            collapsed={collapsed}
            to="/{-$lang}"
            params={{ lang }}
            exact
            label={t.shell.apps}
            icon={<IconApps size={16} stroke={1.75} aria-hidden />}
          />
          <CopyButton
            text={ADD_APP_PROMPT}
            label={t.shell.addYourApp}
            title={collapsed ? t.shell.addYourApp : undefined}
            className={rowClassName(collapsed)}
          >
            {(copied) => (
              <>
                <RowIcon>
                  {copied ? (
                    <IconCheck size={16} stroke={1.75} aria-hidden />
                  ) : (
                    <IconPlus size={16} stroke={1.75} aria-hidden />
                  )}
                </RowIcon>
                {collapsed ? null : (
                  <span className="truncate">{copied ? t.shell.copied : t.shell.addYourApp}</span>
                )}
              </>
            )}
          </CopyButton>
        </div>

        {categories.length > 0 ? (
          <>
            {collapsed ? null : (
              <p className="px-2 pt-5 pb-1 text-[13px] font-medium text-text-muted">
                {t.shell.categories}
              </p>
            )}
            <nav className="flex flex-col gap-0.5" aria-label={t.shell.categories}>
              {categories.map(({ category }) => (
                <SidebarRow
                  key={category}
                  collapsed={collapsed}
                  to="/{-$lang}/category/$category"
                  params={{ lang, category }}
                  label={categoryLabel(category, t)}
                  icon={<CategoryIcon category={category} size={16} />}
                />
              ))}
            </nav>
          </>
        ) : null}

        <div className="mt-auto flex flex-col gap-0.5 pt-2">
          <a
            href={switchHref}
            className={rowClassName(collapsed)}
            title={collapsed ? LOCALE_NATIVE_NAME[other] : undefined}
            aria-label={LOCALE_NATIVE_NAME[other]}
          >
            <RowIcon>
              <IconLanguage size={16} stroke={1.75} aria-hidden />
            </RowIcon>
            {collapsed ? null : <span className="truncate">{LOCALE_NATIVE_NAME[other]}</span>}
          </a>
          <SidebarRow
            collapsed={collapsed}
            href="https://humation.app/avatar"
            label={t.shell.createAvatar}
            title="Open the Humation avatar creator"
            icon={<IconUserCircle size={16} stroke={1.75} aria-hidden />}
            trailing={
              <IconArrowUpRight
                size={12}
                stroke={2}
                className="ml-auto text-text-muted"
                aria-hidden
              />
            }
          />
          <SidebarRow
            collapsed={collapsed}
            href="https://github.com/humation-labs/humation"
            label={t.shell.github}
            title={
              collapsed && stars != null ? `GitHub · ${formatStars(stars)} stars` : undefined
            }
            icon={<IconBrandGithub size={16} stroke={1.75} aria-hidden />}
            trailing={
              stars != null ? (
                <span className="ml-auto inline-flex items-center gap-1 text-xs tabular text-text-muted">
                  <IconStar size={12} stroke={2} aria-hidden />
                  {formatStars(stars)}
                </span>
              ) : null
            }
          />
        </div>
      </nav>
    </aside>
  )
}
