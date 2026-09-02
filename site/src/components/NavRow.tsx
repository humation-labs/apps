import type { ReactNode } from 'react'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'

const offsetClass = {
  sidebar: 'focus-visible:ring-offset-sidebar',
  surface: 'focus-visible:ring-offset-surface',
  bg: 'focus-visible:ring-offset-bg',
} as const

export type NavRowOffset = keyof typeof offsetClass

export function RowIcon({ children }: { children: ReactNode }) {
  return (
    <span className="icon-align inline-flex size-4 shrink-0 items-center justify-center">{children}</span>
  )
}

export function navRowClassName(collapsed = false, offset: NavRowOffset = 'sidebar') {
  const ring = `${focusRing} ${offsetClass[offset]}`
  return collapsed
    ? `flex size-8 items-center justify-center rounded-[8px] text-[13px] font-medium leading-none text-text hover:bg-surface-3/60 ${ring}`
    : `flex h-8 w-full items-center gap-3 rounded-[8px] px-2 text-[13px] font-medium leading-none text-text hover:bg-surface-3/60 ${ring}`
}
