export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 py-8 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
      <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-4 px-4">
        <p>
          A catalog of apps built with <a href="https://humation.app">Humation</a>. Listings are added
          by pull request.
        </p>
        <p>
          <a href="https://github.com/humation-labs/apps">GitHub</a>
        </p>
      </div>
    </footer>
  )
}
