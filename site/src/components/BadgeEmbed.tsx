import { IconCheck, IconCode } from '@tabler/icons-react'
import badgeJson from '../generated/badge.json'
import { useT } from '../i18n'
import { SITE_ORIGIN } from '../lib/constants'
import { CopyButton } from './AddAppButton'

type BadgeJson = {
  width: number
  height: number
}

const badge = badgeJson as BadgeJson

export function BadgeEmbed({ slug }: { slug: string }) {
  const t = useT()

  const pageUrl = `${SITE_ORIGIN}/${slug}`
  const badgeUrl = `${SITE_ORIGIN}/badge/${slug}.svg`
  const previewSrc = `/badge/${slug}.svg`
  const htmlSnippet = `<a href="${pageUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="${t.detail.badgeAlt}" width="${badge.width}" height="${badge.height}"></a>`

  return (
    <div className="mt-5 flex justify-start">
      <CopyButton
        text={htmlSnippet}
        label={t.detail.copyBadgeCode}
        title={t.detail.copyBadgeCode}
        className="group inline-flex flex-col items-center gap-1.5 rounded-lg"
      >
        {(copied) => (
          <>
            <img
              src={previewSrc}
              alt={t.detail.badgeAlt}
              width={badge.width}
              height={badge.height}
              className={`block h-14 w-auto max-w-full rounded-[10px] transition ${copied ? 'ring-2 ring-accent' : 'group-hover:opacity-90 group-active:scale-[0.98]'}`}
            />
            <span className="inline-flex items-center gap-1 text-[12px] leading-none text-text-muted transition group-hover:text-text" aria-live="polite">
              <span className="icon-align inline-flex size-3.5 shrink-0 items-center justify-center">
                {copied ? <IconCheck size={14} stroke={1.75} aria-hidden /> : <IconCode size={14} stroke={1.75} aria-hidden />}
              </span>
              {copied ? t.shell.copied : t.detail.copyBadgeCode}
            </span>
          </>
        )}
      </CopyButton>
    </div>
  )
}
