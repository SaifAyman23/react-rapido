import { Shield, Zap, Palette, Blocks } from 'lucide-react'

import { GridHighlight } from '@/components/astral'
import { WordRotate } from '@/components/ui/word-rotate'
import { APP_NAME } from '@/lib/constants'

const features = [
  { icon: Shield, label: 'Auth', desc: 'Login, register, password reset' },
  { icon: Zap, label: 'API', desc: 'Axios + React Query hooks' },
  { icon: Palette, label: 'Theme', desc: 'Dark / light mode' },
  { icon: Blocks, label: 'UI', desc: 'Radix + shadcn components' },
]

const rotatingWords = ['React 19', 'TypeScript', 'Tailwind v4', 'Zustand', 'React Query']

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.7] dark:opacity-[0.35] text-neutral-800 dark:text-neutral-500"
          style={{
            maskImage:
              'radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.5) 90%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.5) 90%)',
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <GridHighlight />
      </div>

      <main className="relative mx-auto max-w-3xl px-6 py-24 text-center flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
          {APP_NAME}
        </h1>

        <p className="mt-4 text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
          A modern frontend starter built with{' '}
          <WordRotate words={rotatingWords} className="inline font-semibold text-foreground" />
        </p>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {features.map((f) => (
            <div
              key={f.label}
              className="relative rounded-2xl border bg-card px-5 py-5 text-left shadow-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 hover:border-foreground/15"
            >
              <div className="mb-3 flex size-8 items-center justify-center rounded-lg border bg-muted/50">
                <f.icon className="size-4 text-foreground" />
              </div>
              <div className="text-sm font-semibold text-foreground">{f.label}</div>
              <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>

        <p className="mt-16 text-xs text-muted-foreground">
          Configure via{' '}
          <code className="text-foreground text-xs bg-muted px-1.5 py-0.5 rounded-md">
            VITE_APP_NAME
          </code>{' '}
          and{' '}
          <code className="text-foreground text-xs bg-muted px-1.5 py-0.5 rounded-md">
            VITE_API_URL
          </code>
        </p>
      </main>
    </div>
  )
}
