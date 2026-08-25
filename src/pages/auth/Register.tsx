import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useRegister } from '@/api/accounts'
import { extractErrorMessage } from '@/api/axiosInstance'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormError } from '@/components/auth/FormError'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const register = useRegister()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      await register.mutateAsync({
        email,
        password,
        password_confirm: confirmPassword,
      })
      navigate('/verify-otp', { state: { email, purpose: 'email_verification' } })
    } catch (err: unknown) {
      console.error('Registration error:', err)
      setError(extractErrorMessage(err))
    }
  }

  return (
    <AuthLayout title="Create account" subtitle="Free forever. No credit card.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="font-mono text-xs font-black uppercase tracking-wide text-foreground"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="rounded-none border-[3px] border-foreground bg-card font-mono text-sm shadow-[3px_3px_0_var(--foreground)] focus-visible:ring-black"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="font-mono text-xs font-black uppercase tracking-wide text-foreground"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="rounded-none border-[3px] border-foreground bg-card pr-10 font-mono text-sm shadow-[3px_3px_0_var(--foreground)] focus-visible:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 border-[2px] border-foreground bg-card p-1 hover:bg-foreground hover:text-background"
              aria-label={showPassword ? 'Hide' : 'Show'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
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
          className="w-full rounded-none border-[3px] border-foreground bg-foreground font-mono text-xs font-black uppercase tracking-widest text-background shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] dark:hover:shadow-[2px_2px_0_#fff] hover:bg-foreground"
          disabled={register.isPending}
        >
          {register.isPending ? 'Creating...' : 'Create account →'}
        </Button>
      </form>

      <p className="mt-6 text-center font-mono text-xs font-bold text-foreground">
        Have an account?{' '}
        <Link
          to="/login"
          className="border-b-[3px] border-foreground bg-violet-500 px-1 py-0.5 text-white hover:bg-foreground"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
