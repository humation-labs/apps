import { IconMoodEmpty } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="inline-flex size-16 shrink-0 items-center justify-center text-text-muted">
        <IconMoodEmpty size={64} stroke={1.5} aria-hidden />
      </span>
      <h1 className="mt-4 text-4xl/tight font-bold tracking-tight">Page not found</h1>
      <Link
        to="/"
        className="mt-6 inline-flex h-9 items-center justify-center rounded-full bg-accent px-4 text-[14px] leading-none font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        Back to Apps
      </Link>
    </div>
  )
}
