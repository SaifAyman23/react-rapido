import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/theme/ThemeProvider'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed bottom-5 end-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sky active:scale-95 dark:border-white/10 dark:bg-white/5"
    >
      <Sun
        aria-hidden="true"
        className="absolute h-5 w-5 rotate-90 scale-0 text-amber-300 transition-all duration-500 dark:rotate-0 dark:scale-100"
      />
      <Moon
        aria-hidden="true"
        className="absolute h-5 w-5 rotate-0 scale-100 text-blue-300 transition-all duration-500 dark:-rotate-90 dark:scale-0"
      />
    </button>
  )
}
