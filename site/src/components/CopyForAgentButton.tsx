import { IconCheck } from '@tabler/icons-react'
import { ADD_APP_PROMPT } from '../lib/constants'
import { useT } from '../i18n'
import { CopyButton } from './AddAppButton'
import { ClaudeLogo } from './brand/ClaudeLogo'
import { GrokLogo } from './brand/GrokLogo'
import { OpenAILogo } from './brand/OpenAILogo'

const buttonClassName =
  'inline-flex h-9 items-center gap-2 rounded-full bg-surface-2 hover:bg-surface-3 pl-1.5 pr-3.5 text-[13px] font-semibold leading-none ring-1 ring-inset ring-black/5 dark:ring-white/10'

export function CopyForAgentButton() {
  const t = useT()

  return (
    <CopyButton
      text={ADD_APP_PROMPT}
      label={t.shell.copyForAgent}
      className={buttonClassName}
      title={t.shell.copyForAgentTitle}
    >
      {(copied) => (
        <>
          <span className="flex h-7 items-center gap-1.5 rounded-full bg-surface px-2 ring-1 ring-inset ring-black/5 dark:ring-white/10">
            <span className="inline-flex size-3.5 items-center justify-center text-text">
              <ClaudeLogo size={13} className="opacity-90" />
            </span>
            <span className="inline-flex size-3.5 items-center justify-center text-text">
              <OpenAILogo size={13} />
            </span>
            <span className="inline-flex size-3.5 items-center justify-center text-text">
              <GrokLogo size={13} className="translate-x-px" />
            </span>
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap" aria-live="polite">
            {copied ? (
              <>
                <span className="icon-align inline-flex size-3.5 items-center justify-center">
                  <IconCheck size={14} stroke={1.75} aria-hidden />
                </span>
                {t.shell.copied}
              </>
            ) : (
              <>
                <span className="sm:hidden">{t.shell.copy}</span>
                <span className="hidden sm:inline">{t.shell.copyForAgent}</span>
              </>
            )}
          </span>
        </>
      )}
    </CopyButton>
  )
}
