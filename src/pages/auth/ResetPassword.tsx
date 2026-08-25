import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useResetPassword } from '@/api/accounts/hooks'
import { extractErrorMessage } from '@/api/axiosInstance'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormError } from '@/components/auth/FormError'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = location.state?.token || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const resetPasswordMutation = useResetPassword()

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password')
    }
  }, [token, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(newPassword)

    if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
      setError('Password must contain uppercase, number, and special character')
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password: newPassword,
        password_confirm: confirmPassword,
      })

      navigate('/login', {
        state: { message: 'Password reset successful. Please login with your new password.' },
      })
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to reset password'))
    }
  }

  return (
    <AuthLayout title="New password" subtitle="8+ chars, uppercase, number, symbol.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />

        <div className="space-y-2">
          <Label
            htmlFor="newPassword"
            className="font-mono text-xs font-black uppercase tracking-wide text-foreground"
          >
            New password
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              autoFocus
              className="rounded-none border-[3px] border-foreground bg-card pr-10 font-mono text-sm shadow-[3px_3px_0_var(--foreground)] focus-visible:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 border-[2px] border-foreground bg-card p-1 hover:bg-foreground hover:text-background"
              aria-label={showNewPassword ? 'Hide' : 'Show'}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength password={newPassword} />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="font-mono text-xs font-black uppercase tracking-wide text-foreground"
          >
            Confirm
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="rounded-none border-[3px] border-foreground bg-card pr-10 font-mono text-sm shadow-[3px_3px_0_var(--foreground)] focus-visible:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 border-[2px] border-foreground bg-card p-1 hover:bg-foreground hover:text-background"
              aria-label={showConfirmPassword ? 'Hide' : 'Show'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-none border-[3px] border-foreground bg-foreground font-mono text-xs font-black uppercase tracking-widest text-background shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] hover:bg-foreground"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset →'}
        </Button>
      </form>
    </AuthLayout>
  )
}
