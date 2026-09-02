import type { ReactNode } from 'react'
import { IconChevronRight } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

type LangParam = { lang: 'ja' | undefined }

type SectionProps = {
  title: string
  subtitle?: string
  children: ReactNode
} & (
  | { to: '/{-$lang}'; params: LangParam }
  | { to: '/{-$lang}/category/$category'; params: LangParam & { category: string } }
)

export function Section(props: SectionProps) {
  const { title, subtitle, children, to, params } = props

  return (
    <section className="mt-12 min-w-0">
      <Link
        to={to}
        params={params}
        className="group inline-flex items-center gap-0.5 rounded-sm hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <span className="inline-flex size-5 shrink-0 translate-y-[1px] items-center justify-center text-text-muted group-hover:text-accent">
          <IconChevronRight size={20} stroke={2} aria-hidden />
        </span>
      </Link>
      {subtitle ? <p className="mt-1 text-text-muted">{subtitle}</p> : null}
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  )
}
