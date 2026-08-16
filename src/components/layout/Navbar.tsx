import React from 'react'

import { Logo } from '@/components/logo'
import { ModeToggle } from '@/components/theme/ModeToggle'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header>
      <nav className="fixed z-50 w-full px-2">
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5'
          )}
        >
          <div className="flex items-center justify-between py-3 lg:py-4">
            <a href="/" aria-label="home" className="flex items-center space-x-2">
              <Logo />
            </a>
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
