import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import React, { type ComponentPropsWithoutRef, useEffect, useMemo, useState } from 'react'

import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) return
    gsap.fromTo(
      ref.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.7)' }
    )
  }, [])

  return (
    <div ref={ref} className="mx-auto w-full">
      {children}
    </div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode
  delay?: number
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0)
    const childrenArray = useMemo(() => React.Children.toArray(children), [children])

    useEffect(() => {
      if (index < childrenArray.length - 1) {
        const timeout = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length)
        }, delay)

        return () => clearTimeout(timeout)
      }
    }, [index, delay, childrenArray.length])

    const itemsToShow = useMemo(() => {
      const result = childrenArray.slice(0, index + 1).reverse()
      return result
    }, [index, childrenArray])

    return (
      <div className={cn(`flex flex-col items-center gap-4`, className)} {...props}>
        {itemsToShow.map((item) => (
          <AnimatedListItem key={(item as React.ReactElement).key}>{item}</AnimatedListItem>
        ))}
      </div>
    )
  }
)

AnimatedList.displayName = 'AnimatedList'
