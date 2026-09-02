import { IconBrandGithub } from '@tabler/icons-react'
import { LOCALE_NATIVE_NAME, otherLocale, useLocale, useSwitchLocaleHref, useT } from '../i18n'

export function Footer() {
  const locale = useLocale()
  const t = useT()
  const other = otherLocale(locale)
  const switchHref = useSwitchLocaleHref()

  return (
    <footer className="mt-12 border-t border-border pt-8 text-sm text-text-muted">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p>{t.shell.footer}</p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={switchHref}
            className="hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {LOCALE_NATIVE_NAME[other]}
          </a>
          <a
            href="https://github.com/humation-labs/apps"
            rel="noopener"
            className="inline-flex items-center gap-1.5 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <span className="icon-align inline-flex size-4 shrink-0 items-center justify-center">
              <IconBrandGithub size={16} stroke={1.75} aria-hidden />
            </span>
            {t.shell.github}
          </a>
        </div>
      </div>
    </footer>
  )
}
