import { IconArrowLeft, IconLanguage, IconSearch } from '@tabler/icons-react'
import { useRouter, useRouterState } from '@tanstack/react-router'
import {
  LOCALE_NATIVE_NAME,
  localePath,
  otherLocale,
  useLocale,
  useSwitchLocaleHref,
  useT,
} from '../i18n'
import { CopyForAgentButton } from './CopyForAgentButton'
import { LocaleLink } from './LocaleLink'

const ghostRoundClass =
  'inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-3/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

export function NavBar() {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const locale = useLocale()
  const t = useT()
  const other = otherLocale(locale)
  const switchHref = useSwitchLocaleHref()
  const isHome = pathname === localePath(locale, '/')

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
      <div className="flex w-full items-center justify-between gap-3 px-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label={t.shell.back}
            onClick={onBack}
            className={`${ghostRoundClass} ${isHome ? 'invisible' : ''}`}
          >
            <span className="-translate-x-px inline-flex size-[18px] items-center justify-center">
              <IconArrowLeft size={18} stroke={1.75} aria-hidden />
            </span>
          </button>
          <LocaleLink href={localePath(locale, '/')} className="flex min-w-0 truncate items-center lg:hidden">
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
          </LocaleLink>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={switchHref}
            aria-label={LOCALE_NATIVE_NAME[other]}
            className={`${ghostRoundClass} lg:hidden`}
          >
            <span className="inline-flex size-[18px] items-center justify-center">
              <IconLanguage size={18} stroke={1.75} aria-hidden />
            </span>
          </a>
          <LocaleLink
            href={localePath(locale, '/search')}
            aria-label={t.shell.search}
            className={`${ghostRoundClass} lg:hidden`}
          >
            <span className="inline-flex size-[18px] items-center justify-center">
              <IconSearch size={18} stroke={1.75} aria-hidden />
            </span>
          </LocaleLink>
          <CopyForAgentButton />
        </div>
      </div>
    </header>
  )
}
