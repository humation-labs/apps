import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react'
import { useT } from '../i18n'
import { useTheme, type ThemePreference } from '../lib/theme'

const THEME_OPTIONS: { value: ThemePreference; icon: typeof IconSun }[] = [
  { value: 'light', icon: IconSun },
  { value: 'dark', icon: IconMoon },
  { value: 'system', icon: IconDeviceDesktop },
]

export function ThemePreferenceIcon({ preference, size }: { preference: ThemePreference; size: number }) {
  const Icon =
    preference === 'light' ? IconSun : preference === 'dark' ? IconMoon : IconDeviceDesktop
  return <Icon size={size} stroke={1.75} aria-hidden />
}

export function ThemeControl({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  const { preference, setPreference } = useTheme()
  const t = useT()
  const offset = compact ? 'focus-visible:ring-offset-surface' : 'focus-visible:ring-offset-sidebar'

  return (
    <div
      role="group"
      aria-label={t.shell.theme.label}
      className={`flex rounded-[8px] bg-surface-2 p-0.5 ${compact ? 'h-7 shrink-0' : ''} ${className ?? ''}`}
    >
      {THEME_OPTIONS.map(({ value, icon: Icon }) => {
        const selected = preference === value
        const label = t.shell.theme[value]
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            title={label}
            aria-pressed={selected}
            onClick={() => setPreference(value)}
            className={`inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${offset} ${
              compact ? 'size-6' : 'h-7 flex-1'
            } ${selected ? 'rounded-[6px] bg-bg text-text ring-1 ring-black/5 dark:ring-white/10' : 'text-text-muted'}`}
          >
            <Icon size={compact ? 14 : 16} stroke={1.75} aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
