import { ArrowLeft } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import type { OTPurpose } from '@/api/accounts/endpoints'
import { useSendVerificationCode } from '@/api/accounts/hooks'
import { extractErrorMessage } from '@/api/axiosInstance'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormError } from '@/components/auth/FormError'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const sendCodeMutation = useSendVerificationCode()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      await sendCodeMutation.mutateAsync({
        email,
        type: 'password_reset' as OTPurpose,
      })

      navigate('/verify-otp', {
        state: { email, purpose: 'password_reset' as OTPurpose },
      })
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to send verification code'))
    }
  }

  return (
    <AuthLayout title="Reset password" subtitle="We’ll send a 6-digit code.">
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
            autoFocus
            className="rounded-none border-[3px] border-foreground bg-card font-mono text-sm shadow-[3px_3px_0_var(--foreground)] focus-visible:ring-black"
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-none border-[3px] border-foreground bg-foreground font-mono text-xs font-black uppercase tracking-widest text-background shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] hover:bg-foreground"
          disabled={sendCodeMutation.isPending}
        >
          {sendCodeMutation.isPending ? 'Sending...' : 'Send code →'}
        </Button>
      </form>

      <Link
        to="/login"
        className="mt-6 flex items-center justify-center gap-2 border-[3px] border-foreground bg-card px-3 py-2 font-mono text-xs font-black uppercase tracking-wide text-foreground shadow-[3px_3px_0_var(--foreground)] hover:bg-foreground hover:text-background"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>
    </AuthLayout>
  )
}
