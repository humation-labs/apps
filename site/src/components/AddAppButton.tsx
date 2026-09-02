import { useState } from 'react'
import { IconCheck, IconClipboard } from '@tabler/icons-react'
import { ADD_APP_PROMPT } from '../lib/constants'

const defaultClassName =
  'inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white'

export function CopyButton({
  text,
  label = 'Copy',
  className = defaultClassName,
}: {
  text: string
  label?: string
  className?: string
}) {
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
      className={`${className} focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none`}
      onClick={onClick}
      aria-label={copied ? 'Copied' : label}
    >
      {copied ? <IconCheck size={16} aria-hidden /> : <IconClipboard size={16} aria-hidden />}
      {copied ? 'Copied' : label}
    </button>
  )
}

export function AddAppButton({
  label = 'Add your app',
  className = defaultClassName,
}: {
  label?: string
  className?: string
}) {
  return <CopyButton text={ADD_APP_PROMPT} label={label} className={className} />
}
