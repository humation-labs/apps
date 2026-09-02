import { IconSearch } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { AddAppButton } from './AddAppButton'

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src="/logo_humation.svg" alt="Humation" width={102} height={16} className="h-4 w-auto dark:hidden" />
          <img
            src="/logo_humation_dk.svg"
            alt=""
            width={102}
            height={16}
            className="hidden h-4 w-auto dark:block"
          />
          <span>Apps</span>
        </Link>
        <nav className="flex items-center gap-3" aria-label="Site">
          <Link to="/search" className="inline-flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <IconSearch size={18} aria-hidden />
            Search
          </Link>
          <AddAppButton />
        </nav>
      </div>
    </header>
  )
}
