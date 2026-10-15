import { useEffect, useState } from 'react'

export type NearViewOptions = {
  rootMargin?: string
  threshold?: number | number[]
}

/**
 * True while the target is inside (or near, via rootMargin) the viewport.
 * Takes an element id or a ref. Starts false so callers can gate expensive
 * setup (GSAP timelines, SplitText, ScrollTriggers) until the target is
 * actually approaching; latch it into a `ready` flag if setup must run once.
 */
export function useNearView(
  target: string | { readonly current: Element | null },
  options?: NearViewOptions
): boolean {
  const rootMargin = options?.rootMargin ?? '0px'
  const threshold = options?.threshold ?? 0
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = typeof target === 'string' ? document.getElementById(target) : target.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        const next = entry?.isIntersecting ?? true
        setNear((prev) => (prev === next ? prev : next))
      },
      { rootMargin, threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, rootMargin, threshold])

  return near
}
