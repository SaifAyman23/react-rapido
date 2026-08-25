import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
  return <img src="/logo.webp" className={cn('h-10 w-10', className)} alt="" />
}
