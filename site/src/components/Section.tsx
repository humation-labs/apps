import type { ReactNode } from 'react'
import { IconChevronRight } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { IconLine } from './IconLine'

type SectionProps = {
  title: string
  subtitle?: string
  children: ReactNode
} & ({ to: '/' } | { to: '/category/$category'; params: { category: string } })

export function Section(props: SectionProps) {
  const { title, subtitle, children, to } = props

  return (
    <section className="mt-12 min-w-0">
      <Link
        to={to}
        params={'params' in props ? props.params : undefined}
        className="group inline-flex items-center gap-1 hover:text-accent"
      >
        <h2 className="text-2xl font-bold">{title}</h2>
        <IconChevronRight size={24} className="text-text-muted group-hover:text-accent" aria-hidden />
      </Link>
      {subtitle ? <p className="mt-1 text-text-muted">{subtitle}</p> : null}
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  )
}
