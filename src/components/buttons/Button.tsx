import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import * as React from 'react'

import { Button as ShadcnButton } from '../ui/button'
import type { ButtonVariants } from '../ui/button-variants'

import { cn } from '@/lib/utils'

gsap.registerPlugin(Observer)

export type ButtonProps = Omit<React.ComponentProps<'button'>, 'className'> &
  ButtonVariants & {
    className?: string
    btnClassName?: string
    asChild?: boolean
  }

export function Button({
  className,
  btnClassName,
  variant = 'default',
  size,
  asChild,
  children,
  ...props
}: ButtonProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      if (variant === 'default') {
        const accent = wrapperRef.current?.querySelector('.bg-accent')
        const chart = wrapperRef.current?.querySelector('.bg-chart-2')

        if (!accent || !chart) {
          return
        }

        accent.classList.remove('translate-y-[110%]')
        chart.classList.remove('translate-y-[110%]')

        gsap.set([accent, chart], {
          yPercent: 110,
        })

        const accentsTimeline = gsap.timeline({
          paused: true,
          defaults: {
            ease: 'power1.out',
          },
        })

        accentsTimeline.fromTo(
          accent,
          { yPercent: 110 },
          {
            yPercent: -100,
            duration: 0.25,
          }
        )

        accentsTimeline.fromTo(
          chart,
          { yPercent: 110 },
          {
            yPercent: -100,
            duration: 0.25,
          },
          '-=0.32'
        )

        accentsTimeline.set(
          buttonRef.current,
          {
            backgroundColor: 'black',
            color: 'white',
          },
          '-=0.24'
        )

        const observer = Observer.create({
          target: buttonRef.current,
          type: 'pointer',

          onHover: () => {
            accentsTimeline.play()
          },

          onHoverEnd: () => {
            accentsTimeline.reverse()
          },
        })

        return () => observer.kill()
      }

      if (variant === 'destructive') {
        // Add destructive hover animation here
        return
      }

      if (variant === 'outline') {
        const chart = wrapperRef.current?.querySelector('.bg-chart-2')

        if (!chart) {
          return
        }

        const outlineTimeline = gsap.timeline({
          paused: true,
          defaults: {
            ease: 'power1.out',
          },
        })

        outlineTimeline.fromTo(
          chart,
          { width: 0 },
          {
            width: '100%',
            duration: 0.15,
          },
          0
        )

        const observer = Observer.create({
          target: buttonRef.current,
          type: 'pointer',

          onHover: () => {
            outlineTimeline.play()
          },

          onHoverEnd: () => {
            outlineTimeline.reverse()
          },
        })

        return () => observer.kill()
      }

      if (variant === 'secondary') {
        // Add secondary hover animation here
        return
      }

      if (variant === 'ghost') {
        // Add ghost hover animation here
        return
      }

      if (variant === 'link') {
        const chart = wrapperRef.current?.querySelector('.bg-chart-2')

        if (!chart) {
          return
        }

        chart.classList.remove('translate-y-[110%]')

        gsap.set(chart, {
          yPercent: 110,
        })

        const accentsTimeline = gsap.timeline({
          paused: true,
          defaults: {
            ease: 'power1.out',
          },
        })

        accentsTimeline.fromTo(
          chart,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.25,
          },
          0
        )

        const observer = Observer.create({
          target: buttonRef.current,
          type: 'pointer',

          onHover: () => {
            accentsTimeline.play()
          },

          onHoverEnd: () => {
            accentsTimeline.reverse()
          },
        })

        return () => observer.kill()
      }
    },
    { scope: wrapperRef, dependencies: [variant] }
  )

  if (variant === 'default') {
    return (
      <div ref={wrapperRef} className={cn('relative overflow-hidden', className)}>
        <ShadcnButton
          ref={buttonRef}
          variant={variant}
          size={size}
          asChild={asChild}
          className={btnClassName}
          {...props}
        >
          {children}
        </ShadcnButton>
        <div className="absolute pointer-events-none z-10 w-full h-full inset-0 translate-y-[110%] bg-accent"></div>
        <div className="absolute pointer-events-none z-20 w-full h-full inset-0 translate-y-[110%] bg-chart-2"></div>
      </div>
    )
  } else if (variant === 'link') {
    return (
      <div ref={wrapperRef} className={cn('relative overflow-hidden', className)}>
        <div className="absolute pointer-events-none w-full h-full inset-0 translate-y-[110%] bg-chart-2"></div>
        <ShadcnButton
          ref={buttonRef}
          variant={variant}
          size={size}
          className={cn(
            'relative z-10 text-foreground transition-all hover:text-black',
            btnClassName
          )}
          {...props}
        >
          {children}
        </ShadcnButton>
      </div>
    )
  } else if (variant === 'outline') {
    return (
      <div ref={wrapperRef} className={cn('relative overflow-hidden p-0.5', className)}>
        <div className="absolute pointer-events-none inset-y-0 left-1/2 w-0 -translate-x-1/2 bg-chart-2"></div>
        <ShadcnButton
          ref={buttonRef}
          variant={variant}
          size={size}
          className={cn('relative z-10 bg-background', btnClassName)}
          {...props}
        >
          {children}
        </ShadcnButton>
      </div>
    )
  }

  return (
    <ShadcnButton
      variant={variant}
      size={size}
      asChild={asChild}
      className={btnClassName}
      {...props}
    >
      {children}
    </ShadcnButton>
  )
}
