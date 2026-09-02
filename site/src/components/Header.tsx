import { IconSearch } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { AddAppButton } from './AddAppButton'
import { IconLine } from './IconLine'

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-bold">
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
        <nav className="flex shrink-0 items-center gap-2" aria-label="Site">
          <Link
            to="/search"
            aria-label="Search"
            className="inline-flex size-10 items-center justify-center rounded-full text-text"
          >
            <IconSearch size={22} aria-hidden />
          </Link>
          <AddAppButton />
        </nav>
      </div>
    </header>
  )
}
