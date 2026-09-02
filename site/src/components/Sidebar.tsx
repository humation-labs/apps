import { useState, type FormEvent } from 'react'
import { IconApps, IconExternalLink, IconSearch } from '@tabler/icons-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { categoryLabel } from '../lib/constants'
import { AddAppButton } from './AddAppButton'
import { CategoryIcon } from './CategoryIcon'
import { IconLine } from './IconLine'

const navClass =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text hover:bg-surface-2'
const navActiveClass = 'bg-surface-2 text-accent'

export function Sidebar({ categories }: { categories: { category: string; count: number }[] }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface lg:flex">
      <Link to="/" className="flex items-center gap-2 px-5 py-5 font-bold">
        <img
          src="/logo_humation.svg"
          alt="Humation"
          width={102}
          height={16}
          className="h-4 w-auto dark:hidden"
        />
        <img
          src="/logo_humation_dk.svg"
          alt=""
          width={102}
          height={16}
          className="hidden h-4 w-auto dark:block"
        />
        <span>Apps</span>
      </Link>

      <SidebarSearch />

      <nav className="mt-4 flex flex-col gap-0.5 px-2" aria-label="Primary">
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: navActiveClass }} className={navClass}>
          <IconApps size={20} aria-hidden />
          Apps
        </Link>
      </nav>

      {categories.length > 0 ? (
        <>
          <p className="mt-6 px-5 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Categories
          </p>
          <nav className="mt-1 flex flex-col gap-0.5 px-2" aria-label="Categories">
            {categories.map(({ category }) => (
              <Link
                key={category}
                to="/category/$category"
                params={{ category }}
                activeProps={{ className: navActiveClass }}
                className={navClass}
              >
                <CategoryIcon category={category} size={20} />
                {categoryLabel(category)}
              </Link>
            ))}
          </nav>
        </>
      ) : null}

      <div className="mt-auto px-4 pb-6 pt-8">
        <AddAppButton className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white" />
        <a
          href="https://humation.app"
          rel="noopener"
          className="mt-3 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text"
        >
          humation.app
          <IconExternalLink size={14} aria-hidden />
        </a>
      </div>
    </aside>
  )
}

function SidebarSearch() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = q.trim()
    navigate({
      to: '/search',
      search: { q: query },
    })
  }

  return (
    <form role="search" className="px-4" onSubmit={onSubmit}>
      <label className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-text-muted">
        <IconSearch size={16} aria-hidden />
        <input
          type="search"
          name="q"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search"
          className="w-full min-w-0 bg-transparent text-text outline-none placeholder:text-text-muted"
        />
      </label>
    </form>
  )
}
