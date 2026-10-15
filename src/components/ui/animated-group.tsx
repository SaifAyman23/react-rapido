import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import React, { type ReactNode } from 'react'

import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP)

export type PresetType =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'blur'
  | 'blur-slide'
  | 'zoom'
  | 'flip'
  | 'bounce'
  | 'rotate'
  | 'swing'

export type AnimatedGroupProps = {
  children: ReactNode
  className?: string
  preset?: PresetType
  as?: React.ElementType
  asChild?: React.ElementType
  stagger?: number
  duration?: number
}

const PRESET_HIDDEN: Record<PresetType, gsap.TweenVars> = {
  fade: { opacity: 0 },
  slide: { opacity: 0, y: 20 },
  scale: { opacity: 0, scale: 0.8 },
  blur: { opacity: 0, filter: 'blur(4px)' },
  'blur-slide': { opacity: 0, filter: 'blur(4px)', y: 20 },
  zoom: { scale: 0.5 },
  flip: { rotationX: -90 },
  bounce: { y: -50 },
  rotate: { rotation: -180 },
  swing: { rotation: -10 },
}

const PRESET_VISIBLE: Record<PresetType, gsap.TweenVars> = {
  fade: { opacity: 1 },
  slide: { opacity: 1, y: 0 },
  scale: { opacity: 1, scale: 1 },
  blur: { opacity: 1, filter: 'blur(0px)' },
  'blur-slide': { opacity: 1, filter: 'blur(0px)', y: 0 },
  zoom: { opacity: 1, scale: 1 },
  flip: { opacity: 1, rotationX: 0 },
  bounce: { opacity: 1, y: 0 },
  rotate: { opacity: 1, rotation: 0 },
  swing: { opacity: 1, rotation: 0 },
}

const PRESET_EASE: Record<PresetType, string> = {
  fade: 'power2.out',
  slide: 'power2.out',
  scale: 'power2.out',
  blur: 'power2.out',
  'blur-slide': 'power2.out',
  zoom: 'back.out(1.4)',
  flip: 'back.out(1.2)',
  bounce: 'bounce.out',
  rotate: 'back.out(1.2)',
  swing: 'back.out(1.6)',
}

type TagProps = {
  className?: string
  children?: ReactNode
}

function AnimatedGroup({
  children,
  className,
  preset = 'fade',
  as = 'div',
  asChild = 'div',
  stagger = 0.1,
  duration = 0.5,
}: AnimatedGroupProps) {
  const containerRef = React.useRef<HTMLElement | null>(null)

  useGSAP(() => {
    const container = containerRef.current
    if (!container || prefersReducedMotion()) return
    const items = container.querySelectorAll(':scope > *')
    gsap.fromTo(items, PRESET_HIDDEN[preset], {
      ...PRESET_VISIBLE[preset],
      duration,
      ease: PRESET_EASE[preset],
      stagger,
    })
  }, [preset, stagger, duration])

  const Container = as as unknown as React.FC<TagProps & { ref?: React.Ref<HTMLElement> }>
  const Child = asChild as unknown as React.FC<TagProps>

  return (
    <Container ref={containerRef} className={className}>
      {React.Children.map(children, (child, index) => (
        <Child key={index}>{child}</Child>
      ))}
    </Container>
  )
}

export { AnimatedGroup }
