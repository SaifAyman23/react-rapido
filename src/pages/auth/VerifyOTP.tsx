import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { extractErrorMessage } from '@/api/axiosInstance'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormError } from '@/components/auth/FormError'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useVerifyOTP, useSendVerificationCode } from '@/hooks'

export type OTPurpose = 'email_verification' | 'password_reset'

interface VerifyOTPLocationState {
  email: string
  purpose: OTPurpose
}

export function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as VerifyOTPLocationState | null
  const email = state?.email || ''
  const purpose = state?.purpose || 'email_verification'

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timer, setTimer] = useState(60)

  const canResend = timer <= 0

  const verifyMutation = useVerifyOTP()
  const sendCodeMutation = useSendVerificationCode()

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleVerify = useCallback(async () => {
    if (otp.length !== 6) return

    setError('')

    try {
      const response = await verifyMutation.mutateAsync({
        code: otp,
        email,
        purpose,
      })

      if (purpose === 'password_reset') {
        navigate('/reset-password', {
          state: {
            email,
            token: response?.token,
          },
          replace: true,
        })
      } else {
        navigate(`/`, {
          replace: true,
        })
      }
    } catch (err: unknown) {
      console.error('OTP Verification Error:', err)
      setError(extractErrorMessage(err, 'Invalid or expired code. Please try again.'))
      setOtp('')
      setTimer(0)
    }
  }, [otp, email, purpose, verifyMutation, navigate])

  const handleResend = async () => {
    if (!canResend) return

    setError('')
    setSuccess('')
    setOtp('')
    setTimer(60)

    try {
      const data = await sendCodeMutation.mutateAsync({ email, type: purpose })
      setSuccess(data?.message || 'A new verification code has been sent to your email.')
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to resend code. Please try again.'))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (!email) {
      navigate('/register')
    }
  }, [email, navigate])

  const pageTitle = purpose === 'password_reset' ? 'Reset your password' : 'Verify your email'

  const pageSubtitle =
    purpose === 'password_reset'
      ? 'Enter the 6-digit code we sent to your email'
      : `We sent a 6-digit code to ${email}`

  return (
    <AuthLayout title={pageTitle} subtitle={pageSubtitle}>
      <div className="space-y-4">
        <FormError message={error} />
        {success && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-md">
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={verifyMutation.isPending}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={handleVerify}
          disabled={verifyMutation.isPending || otp.length !== 6}
        >
          {verifyMutation.isPending ? 'Verifying...' : 'Verify code'}
        </Button>

        <div className="text-center space-y-2">
          {!canResend ? (
            <p className="text-sm text-muted-foreground">Resend code in {formatTime(timer)}</p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-primary hover:underline font-medium"
            >
              Resend code
            </button>
          )}

          <div>
            <Link
              to={purpose === 'password_reset' ? '/login' : '/register'}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {purpose === 'password_reset' ? 'Back to login' : 'Change email'}
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
