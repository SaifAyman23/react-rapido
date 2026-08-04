import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const calculateStrength = (
    pwd: string
  ): {
    strength: number
    label: string
    color: string
  } => {
    if (!pwd) return { strength: 0, label: '', color: '' }

    let strength = 0

    // Length check
    if (pwd.length >= 8) strength += 25
    if (pwd.length >= 12) strength += 10

    // Character type checks
    if (/[a-z]/.test(pwd)) strength += 15
    if (/[A-Z]/.test(pwd)) strength += 15
    if (/[0-9]/.test(pwd)) strength += 15
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 20

    if (strength <= 25) {
      return { strength: 25, label: 'Weak', color: 'bg-destructive' }
    } else if (strength <= 50) {
      return { strength: 50, label: 'Fair', color: 'bg-orange-500' }
    } else if (strength <= 75) {
      return { strength: 75, label: 'Good', color: 'bg-yellow-500' }
    } else {
      return { strength: 100, label: 'Strong', color: 'bg-green-500' }
    }
  }

  const { strength, label, color } = calculateStrength(password)

  if (!password) return null

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Password strength:</span>
        <span
          className={cn(
            'font-medium',
            strength <= 25 && 'text-destructive',
            strength > 25 && strength <= 50 && 'text-orange-500',
            strength > 50 && strength <= 75 && 'text-yellow-500',
            strength > 75 && 'text-green-500'
          )}
        >
          {label}
        </span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300', color)}
          style={{ width: `${strength}%` }}
        />
      </div>
      <ul className="text-xs text-muted-foreground space-y-1">
        <li className={password.length >= 8 ? 'text-foreground' : ''}>
          {password.length >= 8 ? '✓' : '○'} At least 8 characters
        </li>
        <li className={/[A-Z]/.test(password) ? 'text-foreground' : ''}>
          {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter
        </li>
        <li className={/[0-9]/.test(password) ? 'text-foreground' : ''}>
          {/[0-9]/.test(password) ? '✓' : '○'} One number
        </li>
        <li className={/[^a-zA-Z0-9]/.test(password) ? 'text-foreground' : ''}>
          {/[^a-zA-Z0-9]/.test(password) ? '✓' : '○'} One special character
        </li>
      </ul>
    </div>
  )
}
