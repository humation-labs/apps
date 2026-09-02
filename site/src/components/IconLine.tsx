import type { ReactNode } from 'react'

/** Keep each icon on its own HTML line so prerendered markup is grep-friendly. */
export function IconLine({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex">
      {'\n'}
      {children}
    </span>
  )
}
