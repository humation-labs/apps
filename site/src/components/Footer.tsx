import { IconBrandGithub } from '@tabler/icons-react'
import { IconLine } from './IconLine'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-8 text-sm text-text-muted">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p>A catalog of apps built with Humation. Listings are added by pull request.</p>
        <a
          href="https://github.com/humation-labs/apps"
          rel="noopener"
          className="inline-flex items-center gap-1.5 hover:text-text"
        >
          <IconBrandGithub size={18} aria-hidden />
          GitHub
        </a>
      </div>
    </footer>
  )
}
