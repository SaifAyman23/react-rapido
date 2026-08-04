import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

interface GridHighlightProps {
  cellSize?: number
  className?: string
}

export function GridHighlight({ cellSize = 40, className }: GridHighlightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let currentCell: { x: number; y: number } | null = null
    let fade = 0
    let running = false
    let rafId = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
    }

    const visibilityAt = (x: number, y: number) => {
      const maxDist = Math.hypot(width / 2, height / 2)
      const t = Math.hypot(x - width / 2, y - height / 2) / maxDist
      const v = Math.min(Math.max((t - 0.45) / (0.9 - 0.45), 0), 1)
      return v * 0.5
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      if (!currentCell || fade <= 0.01) return

      const mask = visibilityAt(currentCell.x + cellSize / 2, currentCell.y + cellSize / 2)
      const alpha = mask * 0.85 * fade
      if (alpha <= 0) return

      const dark = document.documentElement.classList.contains('dark')
      ctx.fillStyle = dark ? `rgba(212, 212, 212, ${alpha})` : `rgba(115, 115, 115, ${alpha})`
      ctx.fillRect(currentCell.x, currentCell.y, cellSize, cellSize)
    }

    const startLoop = () => {
      if (running || reduceMotion) return
      running = true
      let lastTime = 0

      const tick = (time: number) => {
        const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60
        lastTime = time

        const target = currentCell ? 1 : 0
        const blend = 1 - Math.pow(0.5, dt / 0.5)
        fade += (target - fade) * blend
        draw()

        if (Math.abs(target - fade) > 0.005) {
          rafId = requestAnimationFrame(tick)
        } else {
          running = false
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    const handleMove = (event: MouseEvent) => {
      const x = Math.floor(event.clientX / cellSize) * cellSize
      const y = Math.floor(event.clientY / cellSize) * cellSize
      if (!currentCell || currentCell.x !== x || currentCell.y !== y) {
        currentCell = { x, y }
        if (reduceMotion) {
          fade = 1
          draw()
        } else {
          startLoop()
        }
      }
    }

    const handleLeave = () => {
      if (!currentCell) return
      currentCell = null
      if (reduceMotion) {
        fade = 0
        draw()
      } else {
        startLoop()
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseleave', handleLeave)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [cellSize])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  )
}
