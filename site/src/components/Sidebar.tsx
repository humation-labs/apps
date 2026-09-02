import { useEffect, useState, type ReactNode } from 'react'
import {
  IconApps,
  IconBrandGithub,
  IconCheck,
  IconExternalLink,
  IconLayoutSidebar,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { ADD_APP_PROMPT, categoryLabel } from '../lib/constants'
import { CopyButton } from './AddAppButton'
import { CategoryIcon } from './CategoryIcon'

const COLLAPSED_KEY = 'sidebar-collapsed'

const ghostButtonClass =
  'inline-flex size-7 items-center justify-center rounded-md text-text hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar'

function rowClassName(collapsed: boolean) {
  return collapsed
    ? 'flex size-8 items-center justify-center rounded-lg text-[13px] font-medium text-text hover:bg-surface-3/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar'
    : 'flex h-8 w-full items-center gap-3 rounded-lg px-2 text-[13px] font-medium text-text hover:bg-surface-3/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar'
}

function RowIcon({ children }: { children: ReactNode }) {
  return (
    <span className="icon-align inline-flex size-4 shrink-0 items-center justify-center">{children}</span>
  )
}

function SidebarRow({
  collapsed,
  icon,
  label,
  to,
  params,
  href,
  exact,
}: {
  collapsed: boolean
  icon: ReactNode
  label: string
} & (
  | { to: '/'; params?: undefined; href?: undefined; exact?: boolean }
  | { to: '/search'; params?: undefined; href?: undefined; exact?: undefined }
  | { to: '/category/$category'; params: { category: string }; href?: undefined; exact?: undefined }
  | { href: string; to?: undefined; params?: undefined; exact?: undefined }
)) {
  const className = rowClassName(collapsed)
  const title = collapsed ? label : undefined
  const ariaLabel = collapsed ? label : undefined
  const inner = (
    <>
      <RowIcon>{icon}</RowIcon>
      {collapsed ? null : <span className="truncate">{label}</span>}
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

  if (to === '/category/$category') {
    return (
      <Link
        to="/category/$category"
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

  if (to === '/search') {
    return (
      <Link to="/search" className={className} title={title} aria-label={ariaLabel}>
        {inner}
      </Link>
    )
  }

  return (
    <Link
      to="/"
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
            aria-label="Expand sidebar"
            aria-expanded={false}
            onClick={toggleCollapsed}
          >
            <IconLayoutSidebar size={16} stroke={1.75} aria-hidden />
          </button>
        ) : (
          <>
            <Link to="/" className="flex min-w-0 items-center">
              <Wordmark />
            </Link>
            <div className="flex shrink-0 items-center">
              <Link to="/search" aria-label="Search" className={ghostButtonClass}>
                <IconSearch size={16} stroke={1.75} aria-hidden />
              </Link>
              <button
                type="button"
                className={ghostButtonClass}
                aria-label="Collapse sidebar"
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
              to="/search"
              label="Search"
              icon={<IconSearch size={16} stroke={1.75} aria-hidden />}
            />
          ) : null}
          <SidebarRow
            collapsed={collapsed}
            to="/"
            exact
            label="Apps"
            icon={<IconApps size={16} stroke={1.75} aria-hidden />}
          />
          <CopyButton
            text={ADD_APP_PROMPT}
            label="Add your app"
            title={collapsed ? 'Add your app' : undefined}
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
                  <span className="truncate">{copied ? 'Copied' : 'Add your app'}</span>
                )}
              </>
            )}
          </CopyButton>
        </div>

        {categories.length > 0 ? (
          <>
            {collapsed ? null : (
              <p className="px-2 pt-5 pb-1 text-[13px] font-medium text-text-muted">Categories</p>
            )}
            <nav className="flex flex-col gap-0.5" aria-label="Categories">
              {categories.map(({ category }) => (
                <SidebarRow
                  key={category}
                  collapsed={collapsed}
                  to="/category/$category"
                  params={{ category }}
                  label={categoryLabel(category)}
                  icon={<CategoryIcon category={category} size={16} />}
                />
              ))}
            </nav>
          </>
        ) : null}

        <div className="mt-auto flex flex-col gap-0.5 pt-2">
          <SidebarRow
            collapsed={collapsed}
            href="https://github.com/humation-labs/apps"
            label="GitHub"
            icon={<IconBrandGithub size={16} stroke={1.75} aria-hidden />}
          />
          <SidebarRow
            collapsed={collapsed}
            href="https://humation.app"
            label="humation.app"
            icon={<IconExternalLink size={16} stroke={1.75} aria-hidden />}
          />
        </div>
      </nav>
    </aside>
  )
}
