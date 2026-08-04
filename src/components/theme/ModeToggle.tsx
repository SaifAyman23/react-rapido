import { Moon, Sun } from 'lucide-react'

import { Button } from '../ui/button'

import { useTheme } from '@/components/theme/ThemeProvider'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <Button variant={'ghost'} onClick={toggleTheme}>
      {theme === 'light' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
