import * as React from 'react'
import { Link } from 'react-router-dom'

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
    <div className="flex min-h-screen flex-col bg-[#F2F0E9] text-black">
      <header className="border-b-[3px] border-black bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 font-mono text-xs font-black tracking-widest text-black hover:opacity-80"
          >
            <div className="grid h-8 w-8 place-items-center border-[2px] border-black bg-black text-white">
              <span className="font-mono text-[10px] font-black">RR</span>
            </div>
            <span>REACT RAPIDO</span>
          </Link>
          <Link
            to={ROUTES.HOME}
            className="border-[3px] border-black bg-white px-3 py-1 font-mono text-xs font-black text-black shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000]"
          >
            ← HOME
          </Link>
        </div>
      </header>

      <div className={cn('flex flex-1 items-center justify-center px-4 py-10 sm:py-12', className)}>
        <div className="w-full max-w-[420px] border-[3px] border-black bg-white p-6 shadow-[8px_8px_0_#000] sm:p-8">
          <div className="mb-6 border-b-[3px] border-black pb-4">
            <div className="inline-block border-[2px] border-black bg-[#8B5CF6] px-2 py-0.5 font-mono text-[10px] font-black tracking-widest text-white">
              AUTH // 02
            </div>
            <h1 className="mt-3 font-mono text-2xl font-black uppercase tracking-tight">{title}</h1>
            {subtitle && (
              <p className="mt-1 font-mono text-xs leading-5 text-zinc-600">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
