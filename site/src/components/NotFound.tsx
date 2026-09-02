import { IconMoodEmpty } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <IconMoodEmpty size={64} className="text-text-muted" aria-hidden />
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <Link
        to="/"
        className="mt-6 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      >
        Back to Apps
      </Link>
    </div>
  )
}
