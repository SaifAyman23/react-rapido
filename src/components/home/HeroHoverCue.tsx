import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

const TAPE_PHRASE = 'Hover for a surprise • '.repeat(4)

export function HeroHoverCue({ visible }: { visible: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      gsap.set(el, { autoAlpha: visible ? 1 : 0, scale: 1, filter: 'blur(0px)' })
      return
    }
    if (visible) {
      gsap.fromTo(
        el,
        { scale: 1.15, autoAlpha: 0, filter: 'blur(12px)' },
        { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' }
      )
    } else {
      gsap.to(el, {
        scale: 1.15,
        autoAlpha: 0,
        filter: 'blur(12px)',
        duration: 0.6,
        ease: 'power2.in',
      })
    }
  }, [visible])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.to(track, { xPercent: -50, duration: 16, repeat: -1, ease: 'none' })
    }, track)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[26%] z-20 w-[min(92vw,680px)] -translate-x-1/2 rotate-[-2deg] overflow-hidden rounded-lg bg-white py-2 opacity-0"
    >
      <div
        ref={trackRef}
        className="flex w-max items-center whitespace-nowrap will-change-transform"
      >
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-[#4D92BC] dark:text-blue-400 sm:text-base">
          {TAPE_PHRASE}
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-[#4D92BC] dark:text-blue-400 sm:text-base"
        >
          {TAPE_PHRASE}
        </span>
      </div>
    </div>
  )
}
