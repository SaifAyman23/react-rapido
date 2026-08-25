import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface StackProps {
  children: React.ReactNode
  className?: string
}

const STICKY_TOP = 96
const TOP_STEP = 18
const SCALE_PER_DEPTH = 0.045

export function Stack({ children, className }: StackProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const items = gsap.utils.toArray<HTMLElement>('.stack-item', rootRef.current)
    if (items.length === 0) return

    const ctx = gsap.context(() => {
      items.forEach((item, i) => {
        item.style.position = 'sticky'
        item.style.top = `${STICKY_TOP + i * (reduceMotion ? 0 : TOP_STEP)}px`
      })

      if (reduceMotion) return

      const cards = items.map((item) => item.querySelector<HTMLElement>('.stack-card'))
      const total = cards.length

      items.forEach((item, i) => {
        if (i === total - 1) return
        const card = cards[i]
        if (!card) return

        const depth = total - 1 - i
        const targetScale = Math.max(0.8, 1 - depth * SCALE_PER_DEPTH)

        gsap.to(card, {
          scale: targetScale,
          transformOrigin: 'top center',
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: items[i + 1],
            start: 'top bottom',
            end: `top ${STICKY_TOP + (i + 1) * TOP_STEP}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      {children}
    </div>
  )
}
