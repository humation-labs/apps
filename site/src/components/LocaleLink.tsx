import { Link } from '@tanstack/react-router'
import type { ComponentProps, ReactNode } from 'react'

type LocaleLinkProps = {
  href: string
  exact?: boolean
  children?: ReactNode
  className?: string
  title?: string
  'aria-label'?: string
  activeProps?: ComponentProps<typeof Link>['activeProps']
  activeOptions?: ComponentProps<typeof Link>['activeOptions']
}

export function LocaleLink({ href, exact, activeOptions, ...props }: LocaleLinkProps) {
  return (
    <Link
      to={href as never}
      activeOptions={exact ? { exact: true, ...activeOptions } : activeOptions}
      {...props}
    />
  )
}
