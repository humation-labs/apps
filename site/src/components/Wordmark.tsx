import { useT } from '../i18n'

export function Wordmark() {
  const t = useT()
  return (
    <span className="flex min-w-0 items-baseline gap-1.5">
      <img
        src="/logo_humation.svg"
        alt="Humation"
        width={102}
        height={16}
        className="h-3.5 w-auto self-baseline dark:hidden"
      />
      <img
        src="/logo_humation_dk.svg"
        alt=""
        width={102}
        height={16}
        className="hidden h-3.5 w-auto self-baseline dark:block"
      />
      <span className="min-w-0 truncate text-[13px] font-medium leading-none text-text-muted">
        {t.shell.apps}
      </span>
    </span>
  )
}
