import { IconBrandGithub } from '@tabler/icons-react'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border pt-8 text-sm text-text-muted">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p>A catalog of apps built with Humation. Listings are added by pull request.</p>
        <a
          href="https://github.com/humation-labs/apps"
          rel="noopener"
          className="inline-flex items-center gap-1.5 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <span className="icon-align inline-flex size-4 shrink-0 items-center justify-center">
            <IconBrandGithub size={16} stroke={1.75} aria-hidden />
          </span>
          GitHub
        </a>
      </div>
    </footer>
  )
}
