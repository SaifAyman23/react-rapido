import { gsap } from 'gsap'
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

type TornImage = string | { src: string; scale?: number; className?: string }

interface TornTextProps {
  text: string
  images: TornImage[]
  as?: 'h1' | 'h2' | 'h3' | 'div' | 'p' | 'span'
  className?: string
  onReady?: () => void
}

export const TornText = forwardRef<HTMLElement, TornTextProps>(function TornText(
  { text, images, as: Tag = 'h1', className, onReady },
  forwardedRef
) {
  const localRef = useRef<HTMLElement>(null)
  const [imgsReady, setImgsReady] = useState(false)

  const setRef = (el: HTMLElement | null) => {
    localRef.current = el
    if (typeof forwardedRef === 'function') forwardedRef(el)
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = el
  }

  const normalized = useMemo(
    () => images.map((img) => (typeof img === 'string' ? { src: img } : img)),
    [images]
  )

  useEffect(() => {
    const idle = (cb: () => void) => {
      if ('requestIdleCallback' in window) {
        ;(
          window as unknown as { requestIdleCallback: (cb: () => void) => void }
        ).requestIdleCallback(cb)
      } else {
        setTimeout(cb, 1200)
      }
    }
    idle(() => {
      normalized.forEach((item) => {
        const img = new Image()
        img.src = item.src
      })
      setImgsReady(true)
      onReady?.()
    })
  }, [normalized, onReady])

  useLayoutEffect(() => {
    const el = localRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const charTexts = el.querySelectorAll<HTMLElement>('.char-text')
    const charImgs = el.querySelectorAll<HTMLElement>('.char-img')
    if (charTexts.length === 0 || charImgs.length === 0) return

    const ctx = gsap.context(() => {
      gsap.set(charImgs, {
        autoAlpha: 0,
        scale: 0.62,
        filter: 'blur(10px)',
        transformOrigin: '50% 50%',
        force3D: true,
      })
      gsap.set(charTexts, {
        autoAlpha: 1,
        scale: 1,
        filter: 'blur(0px)',
        force3D: true,
      })

      let hoverTl: gsap.core.Timeline | null = null

      const onEnter = () => {
        if (hoverTl) hoverTl.kill()
        hoverTl = gsap.timeline()
        hoverTl
          .to(
            charTexts,
            {
              scale: 0.38,
              autoAlpha: 0,
              filter: 'blur(8px)',
              duration: 0.24,
              stagger: { each: 0.045, from: 'start' },
              ease: 'power2.in',
              force3D: true,
            },
            0
          )
          .to(
            charImgs,
            {
              scale: (i: number) => normalized[i]?.scale ?? 4,
              autoAlpha: 1,
              filter: 'blur(0px)',
              duration: 0.38,
              stagger: { each: 0.045, from: 'start' },
              ease: 'back.out(1.18)',
              force3D: true,
            },
            0.06
          )
      }

      const onLeave = () => {
        if (hoverTl) hoverTl.kill()
        hoverTl = gsap.timeline()
        hoverTl
          .to(
            charImgs,
            {
              scale: 0.62,
              autoAlpha: 0,
              filter: 'blur(10px)',
              duration: 0.22,
              stagger: { each: 0.04, from: 'start' },
              ease: 'power2.in',
              force3D: true,
            },
            0
          )
          .to(
            charTexts,
            {
              scale: 1,
              autoAlpha: 1,
              filter: 'blur(0px)',
              duration: 0.3,
              stagger: { each: 0.045, from: 'start' },
              ease: 'power2.out',
              force3D: true,
            },
            0.05
          )
      }

      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
      el.addEventListener('focus', onEnter)
      el.addEventListener('blur', onLeave)

      return () => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        el.removeEventListener('focus', onEnter)
        el.removeEventListener('blur', onLeave)
        if (hoverTl) hoverTl.kill()
      }
    }, el)

    return () => ctx.revert()
  }, [normalized])

  let imgIndex = 0

  return (
    <Tag ref={setRef} tabIndex={0} aria-label={text} className={className}>
      {Array.from(text).map((char, i) => {
        if (char === ' ') {
          return <span key={`space-${i}`} className="inline-block w-[0.22em]" aria-hidden="true" />
        }
        const item = normalized[imgIndex++]
        if (!item) {
          return (
            <span key={`char-${i}`} className="char relative inline-block px-[0.015em]">
              <span className="char-text inline-block leading-none will-change-transform">
                {char}
              </span>
            </span>
          )
        }
        return (
          <span key={`char-${i}-${item.src}`} className="char relative inline-block px-[0.015em]">
            <span className="char-text inline-block leading-none will-change-transform">
              {char}
            </span>
            <img
              src={imgsReady ? item.src : undefined}
              alt=""
              aria-hidden="true"
              draggable={false}
              className={`char-img pointer-events-none absolute inset-0 h-full w-full object-contain will-change-transform ${item.className ?? ''}`}
            />
          </span>
        )
      })}
    </Tag>
  )
})
