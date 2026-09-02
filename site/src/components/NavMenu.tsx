import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  IconArrowUpRight,
  IconBook,
  IconDotsVertical,
  IconLanguage,
  IconSearch,
  IconUserCircle,
} from '@tabler/icons-react'
import { CONTRIBUTING_URL } from '../lib/constants'
import { LOCALE_NATIVE_NAME, localePath, otherLocale, useLocale, useSwitchLocaleHref, useT } from '../i18n'
import { LocaleLink } from './LocaleLink'
import { navRowClassName, RowIcon } from './NavRow'
import { ThemeControl } from './ThemeControl'

const ghostRoundClass =
  'inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-3/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

const rowClass = navRowClassName(false, 'surface')

function MenuLink({
  href,
  external,
  onSelect,
  children,
}: {
  href: string
  external?: boolean
  onSelect: () => void
  children: ReactNode
}) {
  if (external) {
    return (
      <a
        href={href}
        role="menuitem"
        rel="noopener"
        target="_blank"
        className={rowClass}
        onClick={onSelect}
      >
        {children}
      </a>
    )
  }

  return (
    <LocaleLink
      href={href}
      className={rowClass}
      {...({
        role: 'menuitem',
        onClick: onSelect,
      } as { title?: string })}
    >
      {children}
    </LocaleLink>
  )
}

export function NavMenu() {
  const t = useT()
  const locale = useLocale()
  const other = otherLocale(locale)
  const switchHref = useSwitchLocaleHref()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  function close() {
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')
    items?.[0]?.focus()

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      setOpen(false)
    }

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') {
      return
    }
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
    if (items.length === 0) return
    event.preventDefault()
    const index = items.indexOf(document.activeElement as HTMLElement)
    if (event.key === 'Home') {
      items[0]?.focus()
      return
    }
    if (event.key === 'End') {
      items[items.length - 1]?.focus()
      return
    }
    if (event.key === 'ArrowDown') {
      items[(index + 1) % items.length]?.focus()
      return
    }
    const prev = index <= 0 ? items.length - 1 : index - 1
    items[prev]?.focus()
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className={ghostRoundClass}
        aria-label={t.shell.more}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="inline-flex size-[18px] items-center justify-center">
          <IconDotsVertical size={18} stroke={1.75} aria-hidden />
        </span>
      </button>
      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={t.shell.more}
          onKeyDown={onMenuKeyDown}
          className="absolute top-full right-0 z-30 mt-1.5 w-64 rounded-lg bg-surface p-1.5 shadow-lg ring-1 ring-black/10 dark:ring-white/10"
        >
          <MenuLink href={localePath(locale, '/search')} onSelect={close}>
            <RowIcon>
              <IconSearch size={16} stroke={1.75} aria-hidden />
            </RowIcon>
            <span className="truncate">{t.shell.search}</span>
          </MenuLink>
          <div className="my-1 border-t border-border/60" role="separator" />
          <div className="flex h-8 items-center justify-between gap-2 rounded-[8px] px-2">
            <span className="text-[13px] font-medium leading-none text-text">{t.shell.theme.label}</span>
            <ThemeControl compact />
          </div>
          <MenuLink href={switchHref} onSelect={close}>
            <RowIcon>
              <IconLanguage size={16} stroke={1.75} aria-hidden />
            </RowIcon>
            <span className="truncate">{LOCALE_NATIVE_NAME[other]}</span>
          </MenuLink>
          <div className="my-1 border-t border-border/60" role="separator" />
          <MenuLink href="https://humation.app/avatar" external onSelect={close}>
            <RowIcon>
              <IconUserCircle size={16} stroke={1.75} aria-hidden />
            </RowIcon>
            <span className="truncate">{t.shell.createAvatar}</span>
            <IconArrowUpRight size={12} stroke={2} className="ml-auto text-text-muted" aria-hidden />
          </MenuLink>
          <MenuLink href={CONTRIBUTING_URL} external onSelect={close}>
            <RowIcon>
              <IconBook size={16} stroke={1.75} aria-hidden />
            </RowIcon>
            <span className="truncate">{t.shell.contributing}</span>
          </MenuLink>
        </div>
      ) : null}
    </div>
  )
}
