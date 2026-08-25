import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'

import { ProjectCard } from '@/components/projects'
import { projects as defaultProjects } from '@/lib/projects'

gsap.registerPlugin(ScrollTrigger)

const SCROLL_DISTANCE = (count: number) => `+=${(count - 1) * 110}%`

export type Project = (typeof defaultProjects)[number]

interface ProjectsProps {
  items?: readonly Project[]
  eyebrow?: string
  title?: string
  subtitle?: string
}

export default function Projects({
  items = defaultProjects,
  eyebrow = 'Selected Work',
  title = "Things I've\nBuilt",
  subtitle = 'A few projects I worked on. Each one taught me something unique.',
}: ProjectsProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const track = trackRef.current
      if (!track || window.innerWidth < 768) return

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96)

      gsap.to(track, {
        x: () => -getDistance(),
        ease: '1',
        force3D: true,
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top -44%',
          end: SCROLL_DISTANCE(items.length),
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [rootRef, items])

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-32 md:pb-40"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <p className="eyebrow">{eyebrow}</p>

        <h2 className="font-heading mt-4 text-[clamp(3rem,12vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight">
          {title.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:mt-6 sm:text-xl md:text-2xl">
          {subtitle}
        </p>
      </div>

      <div
        className="
          mt-14 overflow-x-auto
          pe-0
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          sm:mt-16
          md:mt-20
          md:overflow-x-visible
          md:px-[max(1.5rem,calc((100vw-1280px)/2))]
        "
      >
        <div
          ref={trackRef}
          className="
            flex w-max items-stretch
            gap-4 px-5 pb-5
            will-change-transform
            sm:gap-6 sm:px-6 sm:pb-6
            md:gap-10 md:px-0 md:pe-[50vw]
            max-md:snap-x
            max-md:snap-mandatory
          "
        >
          {items.map((project) => (
            <ProjectCard
              key={project.title}
              {...project}
              className="
                  w-[calc(100vw-2.5rem)]
                  max-w-[680px]
                  shrink-0
                  max-md:snap-center
                  sm:w-[min(88vw,680px)]
                  md:w-[min(78vw,680px)]
                  animate-fade-in
                "
            />
          ))}
        </div>
      </div>
    </section>
  )
}
