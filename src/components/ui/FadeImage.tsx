import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type FadeImageProps = React.ImgHTMLAttributes<HTMLImageElement>

export function FadeImage({ className, onLoad, ...props }: FadeImageProps) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (el?.complete) {
      const id = requestAnimationFrame(() => setLoaded(true))
      return () => cancelAnimationFrame(id)
    }
  }, [])

  return (
    <img
      ref={ref}
      onLoad={(e) => {
        setLoaded(true)
        onLoad?.(e)
      }}
      className={cn(
        'transition-opacity duration-700 ease-out',
        loaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      {...props}
    />
  )
}
