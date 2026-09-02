import { IconArrowLeft, IconBrandGithub } from '@tabler/icons-react'
import { useRouter, useRouterState } from '@tanstack/react-router'
import { localePath, useLocale, useT } from '../i18n'
import { formatStars, githubStars, useGitHubStars } from '../lib/github'
import { CopyForAgentButton } from './CopyForAgentButton'
import { LocaleLink } from './LocaleLink'
import { NavMenu } from './NavMenu'
import { Wordmark } from './Wordmark'

const ghostRoundClass =
  'inline-flex size-8 items-center justify-center rounded-full bg-surface-2 hover:bg-surface-3 text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

const githubLinkClass =
  'inline-flex size-9 items-center justify-center rounded-full hover:bg-surface-3/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3 sm:text-[13px] sm:font-semibold'

export function NavBar() {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const locale = useLocale()
  const t = useT()
  const isHome = pathname === localePath(locale, '/')
  const stars = useGitHubStars(githubStars())

  function onBack() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    if (window.history.length > 1 && document.referrer.startsWith(window.location.origin)) {
      router.history.back()
    } else {
      void router.navigate({ to: localePath(locale, '/') as never })
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-13 items-center bg-bg/80 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-2 pl-5 pr-3">
        <div className="flex min-w-0 items-center gap-3">
          <LocaleLink
            href={localePath(locale, '/')}
            className="flex min-w-0 items-baseline gap-1.5"
          >
            <Wordmark />
          </LocaleLink>
          <button
            type="button"
            aria-label={t.shell.back}
            onClick={onBack}
            className={`${ghostRoundClass} shrink-0 ${isHome ? 'invisible' : ''}`}
          >
            <span className="-translate-x-px inline-flex size-[18px] items-center justify-center">
              <IconArrowLeft size={18} stroke={1.75} aria-hidden />
            </span>
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href="https://github.com/humation-labs/humation"
            target="_blank"
            rel="noopener"
            aria-label={stars != null ? `GitHub · ${stars} stars` : t.shell.github}
            className={githubLinkClass}
          >
            <span className="icon-align inline-flex size-4 shrink-0 items-center justify-center">
              <IconBrandGithub size={16} stroke={1.75} aria-hidden />
            </span>
            {stars != null ? <span className="hidden tabular sm:inline">{formatStars(stars)}</span> : null}
          </a>
          <CopyForAgentButton />
          <NavMenu />
        </div>
      </div>
    </header>
  )
}
