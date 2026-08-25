import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef, useMemo, type ReactNode, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  scrollContainerRef?: RefObject<HTMLElement>
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null)

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : ''
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      )
    })
  }, [children])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const wordElements = el.querySelectorAll<HTMLElement>('.word')
      wordElements.forEach((w) => {
        w.style.opacity = '1'
        w.style.filter = 'none'
        w.style.transform = 'none'
      })
      return
    }

    const scroller =
      scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window

    let ctx: gsap.Context | undefined

    const setup = () => {
      ctx = gsap.context(() => {
        const wordElements = el.querySelectorAll<HTMLElement>('.word')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top 80%',
            end: 'top 25%',
            scrub: 1.2,
          },
        })

        tl.fromTo(
          wordElements,
          {
            opacity: baseOpacity,
            filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)',
            rotateX: baseRotation * 4,
            yPercent: 14,
            willChange: 'transform, opacity, filter',
          },
          {
            opacity: 1,
            filter: enableBlur ? 'blur(0px)' : 'blur(0px)',
            rotateX: 0,
            yPercent: 0,
            ease: 'sine.out',
            force3D: true,
            stagger: { each: 0.18, from: 'start' },
          }
        )

        tl.to({}, { duration: 0.8 })
      })
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setup()
            io.disconnect()
          }
        })
      },
      { rootMargin: '200px 0px' }
    )
    io.observe(el)

    return () => {
      io.disconnect()
      ctx?.revert()
    }
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, blurStrength])

  return (
    <div className={`grid grid-cols-[auto_1fr] items-center gap-6 ${containerClassName}`}>
      <h2 ref={containerRef} className="my-5">
        <p
          className={`text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.55] font-semibold [perspective:800px] ${textClassName}`}
        >
          {splitText}
        </p>
      </h2>
    </div>
  )
}

export default ScrollReveal
