import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

interface HeroHintProps {
  visible: boolean
  loading: boolean
}

const PHRASE = 'the story begins with a name'

export function HeroHint({ visible, loading }: HeroHintProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(loading)
  const blurTweenRef = useRef<gsap.core.Tween | null>(null)

  const applyVisibility = (show: boolean, animate: boolean) => {
    const el = rootRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { autoAlpha: show ? 1 : 0, y: show ? 0 : -26, filter: 'blur(0px)' })
      return
    }
    gsap.to(el, {
      autoAlpha: show ? 1 : 0,
      y: show ? 0 : -26,
      filter: show ? 'blur(0px)' : 'blur(10px)',
      duration: animate ? 0.5 : 0,
      ease: 'power2.inOut',
    })
  }

  const startBlur = (amt: number) => {
    const dots = rootRef.current?.querySelectorAll('.hint-dot')
    if (!dots || !dots.length) return
    blurTweenRef.current?.kill()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(dots, { filter: `blur(${amt * 0.5}px)` })
      return
    }
    gsap.set(dots, { filter: 'blur(0px)' })
    blurTweenRef.current = gsap.to(dots, {
      filter: `blur(${amt}px)`,
      duration: 0.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: { each: 0.16, from: 'start' },
    })
  }

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    loadingRef.current = loading
    gsap.set(el, { autoAlpha: 0 })

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!reduce) {
        gsap.to(el.querySelectorAll('.hint-dot'), {
          scale: 1.45,
          opacity: 0.35,
          duration: 0.7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: { each: 0.16, from: 'start' },
        })

        gsap.to(el.querySelector('.hint-shimmer'), {
          backgroundPositionX: '200%',
          duration: 2.2,
          repeat: -1,
          ease: 'none',
        })

        gsap.to(el.querySelectorAll('.hint-letter'), {
          yPercent: -22,
          duration: 1,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.045, from: 'center' },
        })

        gsap.to(el.querySelector('.hint-chevron'), {
          y: 7,
          duration: 0.85,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      startBlur(loadingRef.current ? 8 : 4)
    }, el)

    return () => {
      blurTweenRef.current?.kill()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadingRef.current = loading
    startBlur(loading ? 8 : 4)
  }, [loading])

  useEffect(() => {
    applyVisibility(visible, true)
  }, [visible])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[9%] z-30 flex flex-col items-center gap-4 opacity-0 xl:hidden"
    >
      <div className="flex items-center gap-2.5">
        <span className="hint-dot h-2.5 w-2.5 rounded-full dark:bg-white dark:shadow-[0_0_14px_rgba(255,255,255,0.85)] bg-black shadow-[0_0_14px_rgba(0,0,0,0.4)]" />
        <span className="hint-dot h-2.5 w-2.5 rounded-full dark:bg-white dark:shadow-[0_0_14px_rgba(255,255,255,0.85)] bg-black shadow-[0_0_14px_rgba(0,0,0,0.4)]" />
        <span className="hint-dot h-2.5 w-2.5 rounded-full dark:bg-white dark:shadow-[0_0_14px_rgba(255,255,255,0.85)] bg-black shadow-[0_0_14px_rgba(0,0,0,0.4)]" />
      </div>

      <p className="hint-shimmer flex flex-wrap justify-center bg-[length:200%_100%] bg-linear-to-r dark:from-white/55 dark:via-white dark:to-white/55 bg-clip-text font-libertine text-2xl italic text-transparent drop-shadow-[0_1px_12px_rgba(0,0,0,0.3)] from-black/80 via-black to-black/80 sm:text-4xl md:text-5xl">
        {Array.from(PHRASE).map((ch, i) =>
          ch === ' ' ? (
            <span key={`s-${i}`} className="inline-block w-[0.3em]" />
          ) : (
            <span key={`l-${i}`} className="hint-letter inline-block will-change-transform">
              {ch}
            </span>
          )
        )}
      </p>

      <div className="hint-scroll flex flex-col items-center gap-1">
        <span className="text-[0.65rem] uppercase tracking-[0.35em] dark:text-white/65 text-black/70">
          scroll
        </span>
        <span className="hint-chevron block h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 dark:border-white/65 border-black/70" />
      </div>
    </div>
  )
}
