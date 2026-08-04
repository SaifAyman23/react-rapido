import { cn } from '@/lib/utils'

interface AuroraBackgroundProps {
  className?: string
}

const GLOWS = [
  {
    className: 'left-[-8%] top-[-12%] h-[32rem] w-[32rem]',
    alpha: 0.32,
    duration: 24,
    delay: 0,
  },
  {
    className: 'right-[-10%] top-[6%] h-[28rem] w-[28rem]',
    alpha: 0.22,
    duration: 30,
    delay: 6,
  },
  {
    className: 'bottom-[-16%] left-[12%] h-[34rem] w-[34rem]',
    alpha: 0.18,
    duration: 26,
    delay: 12,
  },
]

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {GLOWS.map((glow, i) => (
        <div
          key={i}
          className={cn('animate-aurora absolute rounded-full', glow.className)}
          style={{
            background: `radial-gradient(closest-side, rgba(37, 99, 235, ${glow.alpha}), transparent 70%)`,
            filter: 'blur(60px)',
            animationDuration: `${glow.duration}s`,
            animationDelay: `${glow.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
