import { gsap } from 'gsap'
import React, { useRef, useEffect, useState } from 'react'
import type { IconType } from 'react-icons'

export interface TechItem {
  name: string
  Icon: IconType
  SecondIcon?: IconType
}

export interface SkillCategory {
  title: string
  techs: TechItem[]
}

interface FlowingMenuProps {
  items?: SkillCategory[]
  speed?: number
  textColor?: string
  bgColor?: string
  marqueeBgColor?: string
  marqueeTextColor?: string
  borderColor?: string
}

interface MenuItemProps extends SkillCategory {
  speed: number
  textColor: string
  marqueeBgColor: string
  marqueeTextColor: string
  borderColor: string
  isFirst: boolean
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = '#f5f5f7',
  bgColor = '#000000',
  marqueeBgColor = '#f5f5f7',
  marqueeTextColor = '#0b0a10',
  borderColor = 'rgba(255,255,255,0.14)',
}) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border" style={{ backgroundColor: bgColor }}>
      <nav className="flex flex-col m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem
            key={item.title}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isFirst={idx === 0}
          />
        ))}
      </nav>
    </div>
  )
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  techs,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isFirst,
}) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeInnerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const [repetitions, setRepetitions] = useState(4)

  const animationDefaults = { duration: 0.6, ease: 'expo' }

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2)
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2)
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom'
  }

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement
      if (!marqueeContent) return
      const contentWidth = marqueeContent.offsetWidth
      if (contentWidth === 0) return
      const viewportWidth = window.innerWidth
      const needed = Math.ceil(viewportWidth / contentWidth) + 2
      setRepetitions(Math.max(4, needed))
    }

    calculateRepetitions()
    window.addEventListener('resize', calculateRepetitions)
    return () => window.removeEventListener('resize', calculateRepetitions)
  }, [techs])

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement
      if (!marqueeContent) return
      const contentWidth = marqueeContent.offsetWidth
      if (contentWidth === 0) return

      if (animationRef.current) {
        animationRef.current.kill()
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
      })
    }

    const timer = setTimeout(setupMarquee, 80)
    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [techs, repetitions, speed])

  const handleMouseEnter = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    )

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0)
  }

  const handleMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    )

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
  }

  return (
    <div
      className="relative overflow-hidden"
      ref={itemRef}
      style={{ borderTop: isFirst ? 'none' : `1px solid ${borderColor}` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex cursor-pointer select-none items-center justify-between px-8 py-8 md:px-12"
        style={{ color: textColor }}
      >
        <span className="font-heading text-3xl uppercase leading-none tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </span>
        <span className="text-sm opacity-50">{`${techs.length} tools`}</span>
      </div>

      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-full translate-y-[101%] overflow-hidden"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="flex h-full w-fit items-center" ref={marqueeInnerRef}>
          {[...Array(repetitions)].map((_, idx) => (
            <div
              className="marquee-part flex shrink-0 items-center"
              key={idx}
              style={{ color: marqueeTextColor }}
            >
              {techs.map((tech) => (
                <span
                  key={`${idx}-${tech.name}`}
                  className="flex items-center gap-3 whitespace-nowrap px-6 text-lg font-semibold uppercase tracking-wide sm:text-xl"
                >
                  {tech.Icon && <tech.Icon aria-hidden="true" className="h-7 w-7 shrink-0" />}
                  {tech.SecondIcon && (
                    <tech.SecondIcon aria-hidden="true" className="-ml-6 h-7 w-7 shrink-0" />
                  )}
                  {tech.name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FlowingMenu
