import { useState, type ReactNode } from 'react'
import { IconCheck, IconClipboard } from '@tabler/icons-react'
import { ADD_APP_PROMPT } from '../lib/constants'
import { useT } from '../i18n'

const defaultClassName =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-accent px-4 text-[14px] leading-none font-semibold text-white'

const focusClassName =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

function copyViaTextarea(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '0'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    return document.execCommand('copy')
  } finally {
    textarea.remove()
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Clipboard API rejected; try the textarea fallback below.
  }
  try {
    return copyViaTextarea(text)
  } catch {
    return false
  }
}

export function CopyButton({
  text,
  label,
  failedLabel = 'Copy failed',
  className = defaultClassName,
  title,
  copiedMs = 2000,
  children,
}: {
  text: string
  label?: string
  failedLabel?: string
  className?: string
  title?: string
  copiedMs?: number
  children?: (copied: boolean) => ReactNode
}) {
  const t = useT()
  const resolvedLabel = label ?? t.shell.copy
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)

  async function onClick() {
    const ok = await copyText(text)
    if (ok) {
      setFailed(false)
      setCopied(true)
      window.setTimeout(() => setCopied(false), copiedMs)
      return
    }
    setCopied(false)
    setFailed(true)
    window.setTimeout(() => setFailed(false), 2500)
    window.prompt('Copy this:', text)
  }

  const ariaLabel = failed ? failedLabel : copied ? t.shell.copied : resolvedLabel

  return (
    <button
      type="button"
      className={`${className} ${focusClassName}`}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
    >
      {failed ? (
        <>
          <span className="icon-align -ml-0.5 inline-flex size-4 shrink-0 items-center justify-center">
            <IconClipboard size={16} stroke={1.75} aria-hidden />
          </span>
          {failedLabel}
        </>
      ) : children ? (
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
