import * as React from 'react'
import { Link } from 'react-router-dom'

import { Logo } from '@/components/logo'
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
    <div className="min-h-screen flex">
      <div
        className={cn(
          'w-full relative flex items-center justify-center p-6 sm:p-8 lg:p-12',
          className
        )}
      >
        <Link to={ROUTES.HOME} className="absolute lg:hidden mx-auto top-10">
          <Logo />
        </Link>
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
