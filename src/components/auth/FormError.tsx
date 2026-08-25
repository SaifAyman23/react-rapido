import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null

  return (
    <div
      className={cn(
        'flex items-center gap-2 border-[3px] border-black bg-red-50 px-3 py-2 font-mono text-xs font-black text-red-700 shadow-[3px_3px_0_#000]',
        className
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
