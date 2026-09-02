import { useState } from 'react'
import { IconCheck, IconClipboard } from '@tabler/icons-react'
import { ADD_APP_PROMPT } from '../lib/constants'
import { IconLine } from './IconLine'

export function AddAppButton({
  label = 'Add your app',
  className = 'inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white',
}: {
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function onClick() {
    try {
      await navigator.clipboard.writeText(ADD_APP_PROMPT)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {copied ? <IconCheck size={16} aria-hidden /> : <IconClipboard size={16} aria-hidden />}
      {copied ? 'Copied' : label}
    </button>
  )
}
