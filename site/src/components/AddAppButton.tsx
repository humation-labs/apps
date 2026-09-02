import { useState, type ReactNode } from 'react'
import { IconCheck, IconClipboard } from '@tabler/icons-react'
import { ADD_APP_PROMPT } from '../lib/constants'
import { useT } from '../i18n'

const defaultClassName =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-accent px-4 text-[14px] leading-none font-semibold text-white'

const focusClassName =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

export function CopyButton({
  text,
  label,
  className = defaultClassName,
  title,
  children,
}: {
  text: string
  label?: string
  className?: string
  title?: string
  children?: (copied: boolean) => ReactNode
}) {
  const t = useT()
  const resolvedLabel = label ?? t.shell.copy
  const [copied, setCopied] = useState(false)

  async function onClick() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      className={`${className} ${focusClassName}`}
      onClick={onClick}
      aria-label={copied ? t.shell.copied : resolvedLabel}
      title={title}
    >
      {children ? (
        children(copied)
      ) : (
        <>
          <span className="icon-align -ml-0.5 inline-flex size-4 shrink-0 items-center justify-center">
            {copied ? (
              <IconCheck size={16} stroke={1.75} aria-hidden />
            ) : (
              <IconClipboard size={16} stroke={1.75} aria-hidden />
            )}
          </span>
          {copied ? t.shell.copied : resolvedLabel}
        </>
      )}
    </button>
  )
}

export function AddAppButton({
  label,
  className = defaultClassName,
}: {
  label?: string
  className?: string
}) {
  const t = useT()
  return <CopyButton text={ADD_APP_PROMPT} label={label ?? t.shell.addYourApp} className={className} />
}
