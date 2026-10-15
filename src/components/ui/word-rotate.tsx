import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'

import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

interface WordRotateProps {
  words: string[]
  duration?: number
  className?: string
}

export function WordRotate({ words, duration = 2500, className }: WordRotateProps) {
  const [index, setIndex] = useState(0)
  const elRef = useRef<HTMLHeadingElement>(null)
  const indexRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useGSAP(() => {
    if (prefersReducedMotion() || words.length < 2) return
    const id = window.setInterval(() => {
      const el = elRef.current
      if (!el) return
      gsap.to(el, {
        opacity: 0,
        y: 50,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => {
          if (!mountedRef.current) return
          indexRef.current = (indexRef.current + 1) % words.length
          setIndex(indexRef.current)
        },
      })
    }, duration)
    return () => window.clearInterval(id)
  }, [words, duration])

  useGSAP(() => {
    const el = elRef.current
    if (!el || prefersReducedMotion()) return
    gsap.fromTo(
      el,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
    )
  }, [index])

  if (prefersReducedMotion()) {
    return (
      <div className="overflow-hidden py-2">
        <h1 className={cn(className)}>{words[0]}</h1>
      </div>
    )
  }

  return (
    <div className="overflow-hidden py-2">
      <h1 ref={elRef} className={cn(className)}>
        {words[index]}
      </h1>
    </div>
  )
}
