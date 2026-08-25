import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import bgPaper from '../../assets/img/hero/background paper 3.webp'
import cloud10 from '../../assets/img/hero/cloud 10.webp'
import cloud11 from '../../assets/img/hero/cloud 11.webp'
import cloud9 from '../../assets/img/hero/cloud 9.webp'
import fungi11 from '../../assets/img/hero/fungi 11.webp'
import fungi2 from '../../assets/img/hero/fungi 2.webp'
import fungi5 from '../../assets/img/hero/fungi 5.webp'
import plant3 from '../../assets/img/hero/plant 3.webp'
import plants2 from '../../assets/img/hero/plants 2.webp'
import plants4 from '../../assets/img/hero/plants 4.webp'
import aTorn2 from '../../assets/img/hero/Saif Eldin/a torn 2.webp'
import dTorn from '../../assets/img/hero/Saif Eldin/d torn 1.webp'
import eTorn from '../../assets/img/hero/Saif Eldin/e torn 1.webp'
import fTorn from '../../assets/img/hero/Saif Eldin/f torn 2.webp'
import iTorn2 from '../../assets/img/hero/Saif Eldin/i torn 2.webp'
import iTorn3 from '../../assets/img/hero/Saif Eldin/i torn 3.webp'
import lTorn from '../../assets/img/hero/Saif Eldin/l torn 1.webp'
import nTorn from '../../assets/img/hero/Saif Eldin/n torn 1.webp'
import sTorn from '../../assets/img/hero/Saif Eldin/s torn 2.webp'

import HeroContactBar from '@/components/home/HeroContactBar'
import { HeroHint } from '@/components/home/HeroHint'
import { HeroHoverCue } from '@/components/home/HeroHoverCue'
import { TornText } from '@/components/ui/torn-text'

gsap.registerPlugin(ScrollTrigger)

const heroImages = [
  { src: sTorn, scale: 3 },
  { src: aTorn2, scale: 2 },
  { src: iTorn2, scale: 5 },
  { src: fTorn, scale: 3 },
  { src: eTorn, scale: 2.5 },
  { src: lTorn, scale: 3 },
  { src: dTorn, scale: 2.5 },
  { src: iTorn3, scale: 5 },
  { src: nTorn, scale: 2 },
]

function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLImageElement>(null)
  const cloudsRef = useRef<HTMLDivElement>(null)
  const plantsRef = useRef<HTMLDivElement>(null)
  const fungiRef = useRef<HTMLDivElement>(null)
  const [nameLoaded, setNameLoaded] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const handleNameReady = useCallback(() => setNameLoaded(true), [])

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const pin = pinRef.current
      const gradient = gradientRef.current
      const heading = headingRef.current
      const sub = subRef.current
      const content = contentRef.current
      const paper = paperRef.current
      if (!pin || !gradient || !heading || !sub || !content || !paper) return

      const mm = gsap.matchMedia()

      mm.add('(min-width: 1280px)', () => {
        const clouds = cloudsRef.current ? Array.from(cloudsRef.current.children) : []
        const plants = plantsRef.current ? Array.from(plantsRef.current.children) : []
        const fungi = fungiRef.current ? Array.from(fungiRef.current.children) : []

        gsap.set(clouds, { yPercent: 125, autoAlpha: 0, force3D: true })
        gsap.set(plants, { yPercent: 140, autoAlpha: 0, force3D: true })
        gsap.set(fungi, { yPercent: 155, autoAlpha: 0, force3D: true })
        gsap.set(heading, { scale: 1.16, transformOrigin: '50% 50%', force3D: true })
        gsap.set(sub, { yPercent: 12, autoAlpha: 0.85, force3D: true })
        gsap.set(content, { yPercent: 6, force3D: true })
        gsap.set([...clouds, ...plants, ...fungi, heading, sub, content], {
          willChange: 'transform, opacity',
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=400%',
            scrub: 1.1,
            pin: pin,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        })

        tl.to(heading, { scale: 1, duration: 1, ease: 'power1.inOut' }, 0)
          .to(sub, { yPercent: 0, autoAlpha: 1, duration: 1, ease: 'power1.inOut' }, 0)
          .to(content, { yPercent: 0, duration: 1, ease: 'power1.inOut' }, 0)
          .to(
            clouds,
            {
              yPercent: 15,
              autoAlpha: 1,
              duration: 0.85,
              stagger: { each: 0.09, from: 'random' },
              ease: 'sine.out',
            },
            0.08
          )
          .to(
            plants,
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.85,
              stagger: { each: 0.09, from: 'random' },
              ease: 'sine.out',
            },
            0.3
          )
          .to(
            fungi,
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: { each: 0.1, from: 'random' },
              ease: 'sine.out',
            },
            0.52
          )
          .to({}, { duration: 0.35 })
          .to({}, { duration: 1 })
          .to({}, { duration: 2 })
      })

      mm.add('(max-width: 1279px)', () => {
        gsap.set(heading, { scale: 1.15, autoAlpha: 0, filter: 'blur(12px)', force3D: true })
        gsap.set(sub, { y: 26, autoAlpha: 0, force3D: true })
        gsap.set(content, { yPercent: 0, force3D: true })
        gsap.set(paper, { scale: 1.22, transformOrigin: '50% 40%', force3D: true })
        gsap.set([heading, sub, content, paper], { willChange: 'transform, opacity, filter' })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=180%',
            scrub: 1.1,
            pin: pin,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        })

        tl.to(paper, { scale: 1, duration: 1, ease: 'power2.out' }, 0)
          .to(
            heading,
            {
              scale: 1,
              autoAlpha: 1,
              filter: 'blur(0px)',
              duration: 0.7,
              ease: 'power2.out',
              force3D: true,
            },
            0
          )
          .to(sub, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 0.3)
          .to({}, { duration: 0.6 })
          .to({}, { duration: 1.4 })
      })

      let top = true
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300',
        onUpdate: (self) => {
          const isTop = self.progress < 0.04
          if (isTop !== top) {
            top = isTop
            setAtTop(isTop)
          }
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[200vh] overflow-hidden bg-background">
      <div
        ref={pinRef}
        className="flex h-screen w-full max-w-full items-stretch justify-stretch overflow-hidden"
      >
        <div
          ref={gradientRef}
          className="bg-linear-to-b relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden from-[#68bdf2] to-[#DCF2FF] dark:from-[#0838a9] dark:to-[#040429]"
        >
          <HeroContactBar />
          <HeroHoverCue visible={nameLoaded && !atTop} />
          <HeroHint visible={!nameLoaded || atTop} loading={!nameLoaded} />

          <img
            ref={paperRef}
            fetchPriority="high"
            src={bgPaper}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-color-burn dark:mix-blend-multiply"
          />

          <div
            ref={fungiRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden xl:block overflow-hidden"
          >
            <img
              src={fungi11}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute end-[45%] -bottom-5 w-60 sm:w-150"
            />
            <img
              src={fungi2}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute end-[25%] bottom-0 w-64 lg:max-xl:bottom-14 sm:w-150"
            />
            <img
              src={fungi5}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute start-[10%] bottom-10 w-52 lg:max-xl:bottom-28 sm:w-150"
            />
          </div>

          <div
            ref={plantsRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden xl:block overflow-hidden"
          >
            <img
              src={plant3}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute end-[0%] -bottom-16 w-60 rotate-30 sm:-bottom-40 sm:w-150 lg:max-xl:bottom-4"
            />
            <img
              src={plants2}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute end-[40%] bottom-10 w-32 sm:w-100 lg:max-xl:bottom-16"
            />
            <img
              src={plants4}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute -start-[35%] -bottom-[45%] w-250 sm:w-400"
            />
          </div>

          <div
            ref={cloudsRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 hidden xl:block overflow-hidden"
          >
            <img
              src={cloud10}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute -start-20 top-[42%] w-72 sm:-start-40 sm:top-130 sm:w-300"
            />
            <img
              src={cloud11}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute start-6 top-[46%] w-80 sm:start-60 sm:top-130 sm:w-300"
            />
            <img
              src={cloud9}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute -end-14 top-[44%] w-72 sm:-end-50 sm:top-130 sm:w-300"
            />
          </div>

          <div
            ref={contentRef}
            className="relative z-20 flex max-w-full flex-col items-center justify-center px-6 text-center"
          >
            <TornText
              ref={headingRef}
              text="Saif Eldin"
              images={heroImages}
              onReady={handleNameReady}
              className="font-heavitas flex max-w-full flex-nowrap items-end justify-center whitespace-nowrap leading-none text-white [font-size:min(10.4vw,170px)]"
            />
            <p
              ref={subRef}
              className="mx-auto mt-3 max-w-4xl text-center text-[clamp(0.95rem,1.6vw,1.5rem)] leading-relaxed font-bold text-[#4D92BC] dark:text-blue-400"
            >
              Two years of building the whole stack. <br className="hidden sm:block" />
              ERPs, delivery platforms, AI tools, live-streaming infra. Django under the hood, React
              where it counts, real-time by default.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
