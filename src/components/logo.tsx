import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}
        >
            <rect x="3" y="1" width="2" height="16" rx="1" fill="currentColor" />
            <rect x="13" y="1" width="2" height="16" rx="1" fill="currentColor" />
            <rect x="1" y="4" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="1" y="12" width="16" height="2" rx="1" fill="currentColor" />
        </svg>
    )
}
