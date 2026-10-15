import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

// Structural type instead of `import Lenis from 'lenis'` — this file never
// imports the `lenis` package, so a project without it installed still
// compiles and runs untouched. Anything shaped like this works.
type LenisLike = {
  on: (event: 'scroll', callback: (e: { direction: number }) => void) => void
  off: (event: 'scroll', callback: (e: { direction: number }) => void) => void
}

type ScrollTriggerCtor = typeof ScrollTrigger
type ScrollTriggerInstance = InstanceType<ScrollTriggerCtor>

export type SectionTrackerOptions = {
  /**
   * Return the active Lenis (or Lenis-shaped) instance, if this project
   * uses smooth-scroll. Used only to keep `direction` frame-aligned with
   * the same tick that drives progress, instead of a native `scroll`
   * event which can land a frame off on fast reversals. Defaults to
   * reading `window.__lenis`. Pass `() => undefined` to force the native
   * listener. Omit entirely in a project with no smooth-scroll library —
   * the hook works fine off native scroll events either way.
   */
  getLenis?: () => LenisLike | null | undefined
  /**
   * Only affects the ScrollTrigger-backed path — the fallback re-queries
   * the DOM every tick and never needs a MutationObserver at all.
   *
   * Default (false): the observer watching for late-mounting sections
   * disconnects itself the first time every id is found in the DOM.
   * Correct and cheap for the common case — sections mount once (behind a
   * loader/suspense boundary) and stay mounted for the page's life.
   *
   * Set true if sections can unmount/remount over the page's lifetime —
   * tabs, an SPA shell swapping sections on route change, conditionally
   * rendered sections. The observer then keeps watching indefinitely and
   * rebuilds on any relevant change instead of giving up after the first
   * match. Rebuilds are batched onto a microtask so a burst of DOM
   * mutations in one render collapses into a single rebuild.
   */
  persistentObserver?: boolean
}

export type SectionTracker<T extends string = string> = {
  active: T
  direction: 1 | -1
  progressRef: React.RefObject<Record<T, number>>
}

const defaultGetLenis = (): LenisLike | undefined =>
  (window as unknown as { __lenis?: LenisLike }).__lenis

function findPinTrigger(ST: ScrollTriggerCtor, el: Element): ScrollTriggerInstance | undefined {
  const pins = ST.getAll().filter(
    (st) =>
      !!st.pin && (st.trigger === el || (st.trigger instanceof Element && el.contains(st.trigger)))
  )
  if (pins.length === 0) return undefined
  return pins.reduce((a, b) => (b.end - b.start > a.end - a.start ? b : a))
}

export function useSectionTracker<T extends string>(
  ids: readonly T[],
  options: SectionTrackerOptions = {}
): SectionTracker<T> {
  const { getLenis = defaultGetLenis, persistentObserver = false } = options

  // Latest-ref pattern: callers who don't memoize `getLenis` (very common
  // for an inline `() => window.__lenis`) shouldn't cause this effect to
  // tear down and rebuild every render.
  const getLenisRef = useRef(getLenis)
  const persistentObserverRef = useRef(persistentObserver)

  useEffect(() => {
    getLenisRef.current = getLenis
    persistentObserverRef.current = persistentObserver
  })

  const [active, setActive] = useState<T>(ids[0])
  const [direction, setDirection] = useState<1 | -1>(1)

  const progressRef = useRef(Object.fromEntries(ids.map((id) => [id, 0])) as Record<T, number>)

  const activeRef = useRef<T>(ids[0])
  const lastY = useRef(typeof window === 'undefined' ? 0 : window.scrollY)

  // Section tracking isn't needed before first paint or first scroll,
  // so its ScrollTriggers wait for an idle slot (or the first scroll)
  const [trackingReady, setTrackingReady] = useState(false)

  useEffect(() => {
    const start = () => setTrackingReady(true)
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 2000 })
      return () => window.cancelIdleCallback(id)
    }
    const onScroll = () => start()
    window.addEventListener('scroll', onScroll, { passive: true, once: true })
    const t = window.setTimeout(start, 1)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    if (!trackingReady) {
      return
    }

    const setActiveSafe = (id: T): void => {
      if (activeRef.current === id) return
      activeRef.current = id
      setActive(id)
    }

    const setDirectionSafe = (next: 1 | -1): void => {
      setDirection((prev) => (prev === next ? prev : next))
    }

    // ---------- direction: shared by both the ScrollTrigger and fallback paths ----------
    const lenis = getLenisRef.current?.() ?? undefined
    let tickingDirection = false

    const updateDirectionFromY = (): void => {
      const y = window.scrollY
      const next: 1 | -1 = y >= lastY.current ? 1 : -1
      lastY.current = y
      setDirectionSafe(next)
    }

    const onNativeScroll = (): void => {
      if (tickingDirection) return
      tickingDirection = true
      requestAnimationFrame(() => {
        updateDirectionFromY()
        tickingDirection = false
      })
    }

    // NOTE: assumes Lenis's convention of direction > 0 meaning "scrolling
    // down", matching this hook's own y-increasing = 1 convention. Verify
    // against your installed version — flip the sign here if inverted.
    const onLenisScroll = (e: { direction: number }): void => {
      if (e.direction === 0) return
      setDirectionSafe(e.direction > 0 ? 1 : -1)
    }

    if (lenis) {
      lenis.on('scroll', onLenisScroll)
    } else {
      window.addEventListener('scroll', onNativeScroll, { passive: true })
    }

    // ---------- active + progress: ScrollTrigger if available, else a plain fallback ----------
    let teardownTracking: (() => void) | undefined

    function setupScrollTriggerTracking(ST: ScrollTriggerCtor): () => void {
      let observer: MutationObserver | null = null
      let mutationScheduled = false
      const triggers: ScrollTriggerInstance[] = []

      const createTriggers = (): void => {
        triggers.forEach((t) => t.kill())
        triggers.length = 0

        ids.forEach((id, index) => {
          const el = document.getElementById(id)
          if (!el) return

          const st = ST.create({
            trigger: el,
            start: () => findPinTrigger(ST, el)?.start ?? 'top 90%',
            end: () => findPinTrigger(ST, el)?.end ?? 'bottom top',
            refreshPriority: -1 - index,
            onUpdate: (self) => {
              progressRef.current[id] = Math.min(100, Math.max(0, self.progress * 100))
              if (self.isActive) setActiveSafe(id)
            },
            onEnter: () => setActiveSafe(id),
            onEnterBack: () => setActiveSafe(id),
            onLeave: () => {
              progressRef.current[id] = 100
            },
            onLeaveBack: () => {
              progressRef.current[id] = 0
            },
          })
          triggers.push(st)
        })

        ST.refresh()
      }

      const refresh = (): void => {
        ST.refresh()
      }

      createTriggers()

      window.addEventListener('resize', refresh)
      window.addEventListener('load', createTriggers)

      observer = new MutationObserver(() => {
        if (!persistentObserverRef.current) {
          if (!ids.every((id) => document.getElementById(id))) return
          createTriggers()
          observer?.disconnect()
          observer = null
          return
        }
        if (mutationScheduled) return
        mutationScheduled = true
        queueMicrotask(() => {
          mutationScheduled = false
          createTriggers()
        })
      })
      observer.observe(document.body, { childList: true, subtree: true })

      return () => {
        triggers.forEach((t) => t.kill())
        observer?.disconnect()
        observer = null
        window.removeEventListener('resize', refresh)
        window.removeEventListener('load', createTriggers)
      }
    }

    /** No-GSAP fallback: reads each section's position straight off
     * getBoundingClientRect on every scroll/resize tick. No
     * MutationObserver needed — since nothing is pre-created against a
     * specific element reference, a section that mounts later is simply
     * picked up on the next tick. No pin-awareness (pinning is a
     * ScrollTrigger concept): a pinned section's progress here reflects
     * its unpinned box height, not its real held-in-place scroll span. */
    function setupFallbackTracking(): () => void {
      let tickingProgress = false

      const update = (): void => {
        let next: T | null = null

        for (const id of ids) {
          const el = document.getElementById(id)
          if (!el) continue

          const rect = el.getBoundingClientRect()
          const raw = rect.height > 0 ? -rect.top / rect.height : 0
          progressRef.current[id] = Math.min(100, Math.max(0, raw * 100))

          // Mirrors ScrollTrigger's default 'top top' → 'bottom top' span.
          // If sections overlap at a boundary, the later one in `ids`
          // wins — matches natural top-to-bottom scroll-down reading order.
          if (rect.top <= 0 && rect.bottom > 0) next = id
        }

        if (next) setActiveSafe(next)
      }

      const onTick = (): void => {
        if (tickingProgress) return
        tickingProgress = true
        requestAnimationFrame(() => {
          update()
          tickingProgress = false
        })
      }

      update()
      window.addEventListener('scroll', onTick, { passive: true })
      window.addEventListener('resize', onTick)
      window.addEventListener('load', onTick)

      return () => {
        window.removeEventListener('scroll', onTick)
        window.removeEventListener('resize', onTick)
        window.removeEventListener('load', onTick)
      }
    }

    function setupTracking() {
      if (cancelled) return

      teardownTracking =
        typeof ScrollTrigger.create === 'function'
          ? setupScrollTriggerTracking(ScrollTrigger)
          : setupFallbackTracking()
    }

    setupTracking()

    return () => {
      cancelled = true
      teardownTracking?.()
      if (lenis) {
        lenis.off('scroll', onLenisScroll)
      } else {
        window.removeEventListener('scroll', onNativeScroll)
      }
    }
  }, [ids, trackingReady])

  return { active, direction, progressRef }
}
