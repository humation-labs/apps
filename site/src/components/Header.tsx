import { IconCheck, IconPlus, IconSearch } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { ADD_APP_PROMPT } from '../lib/constants'
import { CopyButton } from './AddAppButton'

const ghostButtonClass =
  'inline-flex size-8 items-center justify-center rounded-md text-text hover:bg-surface-3'

export function Header() {
  return (
    <header className="sticky top-0 z-20 h-12 border-b border-border bg-sidebar lg:hidden">
      <div className="flex h-full items-center justify-between px-3">
        <Link to="/" className="flex min-w-0 items-center">
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
        </Link>
        <nav className="flex shrink-0 items-center gap-0.5" aria-label="Site">
          <Link to="/search" aria-label="Search" className={ghostButtonClass}>
            <span className="inline-flex size-5 items-center justify-center">
              <IconSearch size={18} stroke={1.5} aria-hidden />
            </span>
          </Link>
          <CopyButton text={ADD_APP_PROMPT} label="Add your app" className={ghostButtonClass}>
            {(copied) => (
              <span className="inline-flex size-5 items-center justify-center">
                {copied ? (
                  <IconCheck size={18} stroke={1.5} aria-hidden />
                ) : (
                  <IconPlus size={18} stroke={1.5} aria-hidden />
                )}
              </span>
            )}
          </CopyButton>
        </nav>
      </div>
    </header>
  )
}
