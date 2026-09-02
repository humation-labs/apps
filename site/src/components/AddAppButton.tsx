import { useState } from 'react'
import { ADD_APP_PROMPT } from '../lib/constants'

export function AddAppButton({
  label = 'Add your app',
  className = 'rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900',
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
      {copied ? 'Copied' : label}
    </button>
  )
}
