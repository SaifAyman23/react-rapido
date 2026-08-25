import * as React from 'react'
import { Link } from 'react-router-dom'

import { ModeToggle } from '@/components/theme/ModeToggle'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  className?: string
}

export function AuthLayout({ children, title, subtitle, className }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted text-foreground">
      <header className="border-b-[3px] border-foreground bg-card">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 font-mono text-xs font-black tracking-widest text-foreground hover:opacity-80"
          >
            <div className="grid h-8 w-8 place-items-center border-[2px] border-foreground bg-foreground text-background">
              <span className="font-mono text-[10px] font-black">RR</span>
            </div>
            <span>REACT RAPIDO</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="border-[3px] border-foreground bg-card shadow-[3px_3px_0_var(--foreground)]">
              <ModeToggle />
            </div>
            <Link
              to={ROUTES.HOME}
              className="border-[3px] border-foreground bg-card px-3 py-1 font-mono text-xs font-black text-foreground shadow-[3px_3px_0_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_var(--foreground)]"
            >
              ← HOME
            </Link>
          </div>
        </div>
      </header>

      <div className={cn('flex flex-1 items-center justify-center px-4 py-10 sm:py-12', className)}>
        <div className="w-full max-w-[420px] border-[3px] border-foreground bg-card p-6 shadow-[8px_8px_0_var(--foreground)] sm:p-8">
          <div className="mb-6 border-b-[3px] border-foreground pb-4">
            <div className="inline-block border-[2px] border-foreground bg-violet-500 px-2 py-0.5 font-mono text-[10px] font-black tracking-widest text-white">
              AUTH // 02
            </div>
            <h1 className="mt-3 font-mono text-2xl font-black uppercase tracking-tight text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-1 font-mono text-xs leading-5 text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
