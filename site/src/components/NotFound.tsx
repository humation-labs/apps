import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Not found</h1>
      <p className="mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">
        That page is not in the catalog. Head back to the store and browse apps built with Humation.
      </p>
      <p className="mt-6">
        <Link to="/" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          Back to Apps
        </Link>
      </p>
    </div>
  )
}
