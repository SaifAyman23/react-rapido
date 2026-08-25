/* eslint-disable react-refresh/only-export-components */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'

import photoLeft from '@/assets/img/about/left.webp'
import photoMiddle from '@/assets/img/about/middle.webp'
import photoRight from '@/assets/img/about/right.webp'
import { FadeImage } from '@/components/ui/FadeImage'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface AboutPhoto {
  src: string
  width: number
  height: number
  className?: string
  scatter?: { x: number; y: number; rotation: number }
  stacked?: { x: number; y: number; rotation: number }
}

export const defaultPhotos: AboutPhoto[] = [
  {
    src: photoLeft,
    width: 900,
    height: 926,
    className: 'h-[360px] w-[280px] sm:size-170',
  },
  {
    src: photoMiddle,
    width: 569,
    height: 960,
    className: 'h-[360px] w-[280px] sm:h-[480px] sm:w-[360px]',
  },
  {
    src: photoRight,
    width: 900,
    height: 939,
    className: 'h-[360px] w-[280px] sm:h-[480px] sm:w-[420px]',
  },
]

export const defaultScatter = [
  { x: -270, y: 46, rotation: -16 },
  { x: 0, y: -34, rotation: 0 },
  { x: 270, y: 46, rotation: 16 },
]

export const defaultStacked = [
  { x: -10, y: 6, rotation: -3 },
  { x: 0, y: 0, rotation: 0 },
  { x: 10, y: 12, rotation: 3 },
]

interface AboutProps {
  photos?: AboutPhoto[]
  scatter?: typeof defaultScatter
  stacked?: typeof defaultStacked
  eyebrow?: string
  title?: string
  quote?: string
  footer?: string
}

export default function About({
  photos = defaultPhotos,
  scatter = defaultScatter,
  stacked = defaultStacked,
  eyebrow = 'About',
  title = 'The man behind\nthe work',
  quote = "I build software. When I'm not shipping code, I'm behind a camera, cutting footage, or out on my bike. Different crafts, same obsession with the details.",
  footer = 'coding, video editing, photography, long rides. A cool guy indeed.',
}: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const isSmall = typeof window !== 'undefined' && window.innerWidth < 640
      const k = isSmall ? 0.45 : 1
      const scaleOffsets = (o: { x: number; y: number; rotation: number }) => ({
        x: o.x * k,
        y: o.y * k,
        rotation: o.rotation,
      })

      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { autoAlpha: 0, y: 60, letterSpacing: '0.06em' },
          {
            autoAlpha: 1,
            y: 0,
            letterSpacing: '-0.02em',
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }

      const items = gsap.utils.toArray<HTMLElement>('.about-photo', deckRef.current)
      if (items.length !== photos.length) return

      items.forEach((item, i) => {
        gsap.set(item, {
          ...scaleOffsets(photos[i].stacked ?? stacked[i]),
          zIndex: i + 1,
          force3D: true,
        })
      })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: deckRef.current,
            start: 'top 75%',
            end: 'top 20%',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        })
        .to(
          items[0],
          {
            ...scaleOffsets(photos[0].scatter ?? scatter[0]),
            duration: 1,
            ease: 'sine.inOut',
            force3D: true,
          },
          0
        )
        .to(
          items[1],
          {
            ...scaleOffsets(photos[1].scatter ?? scatter[1]),
            scale: 1.05,
            duration: 1,
            ease: 'sine.inOut',
            force3D: true,
          },
          0
        )
        .to(
          items[2],
          {
            ...scaleOffsets(photos[2].scatter ?? scatter[2]),
            duration: 1,
            ease: 'sine.inOut',
            force3D: true,
          },
          0
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef, photos, scatter, stacked])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background px-6 pb-36 pt-8">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow text-center">{eyebrow}</p>

        <h2
          ref={headingRef}
          className="font-libertine mt-4 text-center text-[clamp(3rem,8vw,7.5rem)] italic leading-[1.05] tracking-tight text-foreground"
        >
          {title.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>

        <div
          ref={deckRef}
          className="relative mx-auto mt-10 flex h-[420px] max-w-full items-center justify-center sm:h-[520px]"
        >
          {photos.map((photo) => (
            <div key={photo.src} className={cn('about-photo absolute ', photo.className)}>
              <FadeImage
                src={photo.src}
                alt=""
                draggable={false}
                loading="lazy"
                decoding="async"
                width={photo.width}
                height={photo.height}
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
          ))}
        </div>

        <blockquote className="mx-auto mt-14 max-w-3xl text-center">
          <p className="font-libertine text-2xl italic leading-relaxed text-foreground sm:text-3xl">
            &ldquo;{quote}&rdquo;
          </p>
          <footer className="font-libertine mt-5 text-lg italic text-muted-foreground">
            {footer}
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
