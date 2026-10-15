import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import { prefersReducedMotion } from '@/lib/motion'

/** The active Lenis instance, if smooth scroll is running. */
export function getLenis(): Lenis | undefined {
  return (window as unknown as { __lenis?: Lenis }).__lenis
}

export function initSmoothScroll() {
  if (prefersReducedMotion()) return null

  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    gestureOrientation: 'vertical',
  })

  ;(window as unknown as { __lenis?: typeof lenis }).__lenis = lenis
  lenis.on('scroll', ScrollTrigger.update)

  // Phone URL-bar resizes must not trigger refreshes that shift pins
  ScrollTrigger.config({ ignoreMobileResize: true })

  // Keep Lenis's scroll-height limit in sync whenever ScrollTrigger's own
  // layout changes (e.g. pin spacers being inserted/resized).
  const onRefresh = () => lenis.resize()
  ScrollTrigger.addEventListener('refresh', onRefresh)

  const raf = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return () => {
    ScrollTrigger.removeEventListener('refresh', onRefresh)
    gsap.ticker.remove(raf)
    lenis.destroy()
    delete (window as unknown as { __lenis?: unknown }).__lenis
  }
}
