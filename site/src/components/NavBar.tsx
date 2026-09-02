import { IconArrowLeft, IconSearch } from '@tabler/icons-react'
import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import { CopyForAgentButton } from './CopyForAgentButton'

const ghostRoundClass =
  'inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-3/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

export function NavBar() {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isHome = pathname === '/'

  function onBack() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    if (window.history.length > 1 && document.referrer.startsWith(window.location.origin)) {
      router.history.back()
    } else {
      void router.navigate({ to: '/' })
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-13 items-center bg-bg/80 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-3 px-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className={`${ghostRoundClass} ${isHome ? 'invisible' : ''}`}
          >
            <span className="-translate-x-px inline-flex size-[18px] items-center justify-center">
              <IconArrowLeft size={18} stroke={1.75} aria-hidden />
            </span>
          </button>
          <Link to="/" className="flex min-w-0 truncate items-center lg:hidden">
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
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link to="/search" aria-label="Search" className={`${ghostRoundClass} lg:hidden`}>
            <span className="inline-flex size-[18px] items-center justify-center">
              <IconSearch size={18} stroke={1.75} aria-hidden />
            </span>
          </Link>
          <CopyForAgentButton />
        </div>
      </div>
    </header>
  )
}
