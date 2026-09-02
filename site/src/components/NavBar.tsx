import { IconBrandGithub } from '@tabler/icons-react'
import { localePath, useLocale, useT } from '../i18n'
import { formatStars, githubStars, useGitHubStars } from '../lib/github'
import { CopyForAgentButton } from './CopyForAgentButton'
import { LocaleLink } from './LocaleLink'
import { NavMenu } from './NavMenu'
import { Wordmark } from './Wordmark'

const githubLinkClass =
  'inline-flex size-9 items-center justify-center rounded-full hover:bg-surface-3/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3 sm:text-[13px] sm:font-semibold'

export function NavBar() {
  const locale = useLocale()
  const t = useT()
  const stars = useGitHubStars(githubStars())

  return (
    <header className="sticky top-0 z-20 flex h-13 items-center bg-bg/80 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-2 pl-5 pr-3">
        <LocaleLink
          href={localePath(locale, '/')}
          className="flex min-w-0 items-baseline gap-1.5"
        >
          <Wordmark />
        </LocaleLink>
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
