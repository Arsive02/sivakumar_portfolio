import { toggleTheme, useTheme } from '@/lib/theme'

export function ThemeToggle() {
  const theme = useTheme()
  return (
    <button onClick={toggleTheme} className="eyebrow group flex items-center gap-2 hover:text-fg" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 transition-transform duration-700 group-hover:rotate-180" aria-hidden>
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 2a8 8 0 0 1 0 16z" fill="currentColor" />
      </svg>
      <span className="hidden sm:inline">{theme === 'dark' ? 'Ink' : 'Paper'}</span>
    </button>
  )
}
