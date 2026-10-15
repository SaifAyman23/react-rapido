import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import React from 'react'

import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

export type PresetType = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide'

export type PerType = 'word' | 'char' | 'line'

export type TextEffectProps = {
  children: string
  per?: PerType
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  preset?: PresetType
  delay?: number
  speedReveal?: number
  speedSegment?: number
  trigger?: boolean
  onAnimationComplete?: () => void
  onAnimationStart?: () => void
  segmentWrapperClassName?: string
  style?: React.CSSProperties
}

const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
}

const presetHidden: Record<PresetType, gsap.TweenVars> = {
  blur: { opacity: 0, filter: 'blur(12px)' },
  'fade-in-blur': { opacity: 0, y: 20, filter: 'blur(12px)' },
  scale: { opacity: 0, scale: 0 },
  fade: { opacity: 0 },
  slide: { opacity: 0, y: 20 },
}

const presetVisible: Record<PresetType, gsap.TweenVars> = {
  blur: { opacity: 1, filter: 'blur(0px)' },
  'fade-in-blur': { opacity: 1, y: 0, filter: 'blur(0px)' },
  scale: { opacity: 1, scale: 1 },
  fade: { opacity: 1 },
  slide: { opacity: 1, y: 0 },
}

const AnimationComponent: React.FC<{
  segment: string
  per: 'line' | 'word' | 'char'
  segmentWrapperClassName?: string
}> = React.memo(({ segment, per, segmentWrapperClassName }) => {
  const content =
    per === 'line' ? (
      <span className="block">{segment}</span>
    ) : per === 'word' ? (
      <span aria-hidden="true" className="inline-block whitespace-pre">
        {segment}
      </span>
    ) : (
      <span className="inline-block whitespace-pre">
        {segment.split('').map((char, charIndex) => (
          <span
            key={`char-${charIndex}`}
            aria-hidden="true"
            className="inline-block whitespace-pre"
          >
            {char}
          </span>
        ))}
      </span>
    )

  if (!segmentWrapperClassName) {
    return content
  }

  const defaultWrapperClassName = per === 'line' ? 'block' : 'inline-block'

  return <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>{content}</span>
})

AnimationComponent.displayName = 'AnimationComponent'

const splitText = (text: string, per: PerType) => {
  if (per === 'line') return text.split('\n')
  return text.split(/(\s+)/)
}

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  className,
  preset = 'fade',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  style,
}: TextEffectProps) {
  const containerRef = React.useRef<HTMLElement | null>(null)
  const segments = splitText(children, per)

  const Tag = as as unknown as React.FC<{
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
    ref?: React.Ref<HTMLElement>
  }>

  const stagger = defaultStaggerTimes[per] / speedReveal
  const duration = 0.3 / speedSegment

  useGSAP(() => {
    const container = containerRef.current
    if (!container || !trigger) return
    const items = container.querySelectorAll(':scope > *:not(.sr-only)')
    if (prefersReducedMotion()) {
      gsap.set(items, presetVisible[preset])
      onAnimationComplete?.()
      return
    }
    const tween = gsap.fromTo(items, presetHidden[preset], {
      ...presetVisible[preset],
      duration,
      ease: 'power2.out',
      stagger,
      delay,
      onStart: () => onAnimationStart?.(),
      onComplete: () => onAnimationComplete?.(),
    })
    return () => {
      tween.kill()
    }
  }, [trigger, preset, stagger, duration, delay])

  if (!trigger) return null

  return (
    <Tag ref={containerRef} className={className} style={style}>
      {per !== 'line' ? <span className="sr-only">{children}</span> : null}
      {segments.map((segment, index) => (
        <AnimationComponent
          key={`${per}-${index}-${segment}`}
          segment={segment}
          per={per}
          segmentWrapperClassName={segmentWrapperClassName}
        />
      ))}
    </Tag>
  )
}
