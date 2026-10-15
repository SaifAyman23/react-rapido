import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as React from 'react'

import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type AnimatedHeaderProps = {
  className?: string
  children: React.ReactNode
}

export function AnimatedHeader({ className, children }: AnimatedHeaderProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const textRef = React.useRef<HTMLHeadingElement>(null)
  const accentRef = React.useRef<HTMLDivElement>(null)
  const chartRef = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const wrapper = wrapperRef.current
    const text = textRef.current
    const accent = accentRef.current
    const chart = chartRef.current

    if (!wrapper || !text || !accent || !chart) {
      return
    }

    const mm = gsap.matchMedia()

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        // Reduced motion: no wipe at all, just show the text
        if (context.conditions?.reduce) {
          gsap.set([accent, chart], { autoAlpha: 0 })
          return
        }

        // Start state: both bars parked off to the left, text hidden
        gsap.set([accent, chart], { xPercent: -100 })
        gsap.set(text, { opacity: 0 })

        const tl = gsap.timeline({
          paused: true,
          defaults: { duration: 0.5, ease: 'power2.inOut' },
        })

        // Each bar sweeps across the whole width, the chart bar slightly behind
        tl.to(accent, { xPercent: 110 }, 0)
        tl.to(chart, { xPercent: 110 }, 0.1)

        // Reveal the text at the moment the accent bar fully covers it
        // (power2.inOut is symmetrical, so its midpoint is exactly xPercent 0)
        tl.set(text, { opacity: 1, ease: 'steps(1)' }, 0.25)

        ScrollTrigger.create({
          trigger: wrapper,
          start: 'top 85%',
          once: true,
          onEnter: () => tl.play(),
        })
      }
    )

    return () => mm.revert()
  }, [])

  return (
    <div ref={wrapperRef} className="relative overflow-hidden py-2">
      <h1 ref={textRef} className={cn('animated-header-text relative', className)}>
        {children}
      </h1>

      <div ref={accentRef} className="absolute pointer-events-none inset-0 z-10 bg-accent" />
      <div ref={chartRef} className="absolute pointer-events-none inset-0 z-20 bg-chart-2" />
    </div>
  )
}
