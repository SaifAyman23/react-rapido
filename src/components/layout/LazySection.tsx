import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React from 'react'

import { useNearView } from '@/hooks'

// Mounts are serialized so a fast scroll never lands several section commits
// (render + text splitting + trigger setup + refresh) on the same frames:
// each mount claims the next free 250ms slot, keeping scroll hitches small.
let nextMountSlot = 0
const MOUNT_GAP = 250

function claimMountDelay(): number {
  const now = Date.now()
  const delay = Math.max(0, nextMountSlot - now)
  nextMountSlot = now + delay + MOUNT_GAP
  return delay
}

function Placeholder({
  anchorRef,
  minHeight = '100svh',
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>
  minHeight?: string
}) {
  return <div ref={anchorRef} aria-hidden="true" style={{ minHeight }} />
}

export function LazySection({
  children,
  minHeight = '100svh',
}: {
  children: React.ReactNode
  minHeight?: string
}) {
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [margin, setMargin] = React.useState('0px 0px 100% 0px')
  const near = useNearView(anchorRef, { rootMargin: margin })
  const [ready, setReady] = React.useState(false)
  const beforeRef = React.useRef(0)

  React.useEffect(() => {
    const widen = () => setMargin('0px 0px 250% 0px')
    window.addEventListener('wheel', widen, { passive: true, once: true })
    window.addEventListener('touchstart', widen, { passive: true, once: true })
    window.addEventListener('scroll', widen, { passive: true, once: true })
    return () => {
      window.removeEventListener('wheel', widen)
      window.removeEventListener('touchstart', widen)
      window.removeEventListener('scroll', widen)
    }
  }, [])

  React.useEffect(() => {
    if (!near || ready) {
      return
    }
    beforeRef.current = document.documentElement.scrollHeight
    const delay = claimMountDelay()
    if (delay <= 0) {
      React.startTransition(() => setReady(true))
      return
    }
    const t = window.setTimeout(() => {
      React.startTransition(() => setReady(true))
    }, delay)
    return () => window.clearTimeout(t)
  }, [near, ready])

  React.useEffect(() => {
    if (!ready) {
      return
    }
    const t = window.setTimeout(() => {
      const after = document.documentElement.scrollHeight
      if (Math.abs(after - beforeRef.current) > 8) {
        ScrollTrigger.refresh()
      }
    }, 100)
    return () => window.clearTimeout(t)
  }, [ready])

  if (!ready) {
    return <Placeholder anchorRef={anchorRef} minHeight={minHeight} />
  }

  return (
    <React.Suspense fallback={<Placeholder anchorRef={anchorRef} minHeight={minHeight} />}>
      {children}
    </React.Suspense>
  )
}
