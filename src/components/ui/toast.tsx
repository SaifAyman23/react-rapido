import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { AlertTriangle, CheckCircle, Info, X, XCircle, type LucideIcon } from 'lucide-react'
import React from 'react'

import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ToastAlignment =
  'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right'

export interface ToastProps {
  open: boolean
  message: string
  /** @default 'success' */
  type?: ToastType
  /** @default 'bottom-center' */
  alignment?: ToastAlignment
  /** Show a close ✕ button */
  dismissible?: boolean
  onClose?: () => void
}

// ── Config ────────────────────────────────────────────────────────────────────

const typeConfig: Record<
  ToastType,
  {
    icon: LucideIcon
    iconClass: string
    barClass: string
  }
> = {
  success: { icon: CheckCircle, iconClass: 'text-emerald-400', barClass: 'bg-emerald-400' },
  error: { icon: XCircle, iconClass: 'text-red-400', barClass: 'bg-red-400' },
  warning: { icon: AlertTriangle, iconClass: 'text-amber-400', barClass: 'bg-amber-400' },
  info: { icon: Info, iconClass: 'text-blue-400', barClass: 'bg-blue-400' },
}

const alignmentClass: Record<ToastAlignment, string> = {
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-6 left-6',
  'bottom-right': 'bottom-6 right-6',
  'top-center': 'top-6 left-1/2 -translate-x-1/2',
  'top-left': 'top-6 left-6',
  'top-right': 'top-6 right-6',
}

// initial/exit y direction based on whether toast is on top or bottom
const yOffset = (alignment: ToastAlignment) => (alignment.startsWith('top') ? -16 : 16)

// ── Component ─────────────────────────────────────────────────────────────────

export function Toast({
  open,
  message,
  type = 'success',
  alignment = 'bottom-center',
  dismissible = false,
  onClose,
}: ToastProps) {
  const [closing, setClosing] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const { icon: Icon, iconClass } = typeConfig[type]
  const y = yOffset(alignment)
  const render = open || closing

  useGSAP(() => {
    const el = ref.current
    if (!el || !render) return
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1 })
      if (!open) setClosing(false)
      return
    }
    if (open) {
      setClosing(false)
      gsap.fromTo(
        el,
        { opacity: 0, y, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' }
      )
    } else {
      setClosing(true)
      const tween = gsap.to(el, {
        opacity: 0,
        y,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => setClosing(false),
      })
      return () => {
        tween.kill()
      }
    }
  }, [open, render, y])

  if (!render) return null

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn(
        'fixed z-50 flex items-center gap-3',
        'bg-foreground text-background',
        'text-sm font-medium px-4 py-3 rounded-2xl shadow-xl',
        alignmentClass[alignment]
      )}
    >
      <Icon className={cn('w-4 h-4 shrink-0 ml-2', iconClass)} strokeWidth={2.5} />

      <span>{message}</span>

      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="ml-1 w-5 h-5 rounded-md flex items-center justify-center text-background/50 hover:text-background transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
