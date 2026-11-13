import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { extractErrorMessage } from '@/api/errors'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormError } from '@/components/auth/FormError'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useResendVerification, useVerifyEmail } from '@/hooks'

interface VerifyEmailLocationState {
  email: string
}

const RESEND_SECONDS = 60

export function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as VerifyEmailLocationState | null
  const email = state?.email || ''

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timer, setTimer] = useState(RESEND_SECONDS)

  const canResend = timer <= 0

  const verifyMutation = useVerifyEmail()
  const resendMutation = useResendVerification()

  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  useEffect(() => {
    if (!email) navigate('/register')
  }, [email, navigate])

  const handleVerify = useCallback(async () => {
    if (otp.length !== 6) return
    setError('')

    try {
      await verifyMutation.mutateAsync({ email, code: otp })
      navigate('/', { replace: true })
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Invalid or expired code. Please try again.'))
      setOtp('')
      setTimer(0)
    }
  }, [otp, email, verifyMutation, navigate])

  const handleResend = async () => {
    if (!canResend) return

    setError('')
    setSuccess('')
    setOtp('')
    setTimer(RESEND_SECONDS)

    try {
      await resendMutation.mutateAsync({ email })
      setSuccess('A new verification code has been sent to your email.')
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to resend code. Please try again.'))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AuthLayout title="Verify your email" subtitle={`We sent a 6-digit code to ${email}`}>
      <div className="space-y-4">
        <FormError message={error} />
        {success && (
          <div className="border-[3px] border-foreground bg-emerald-50 dark:bg-emerald-950 px-3 py-2 font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">
            {success}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={verifyMutation.isPending}
              className="gap-2"
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-10 rounded-none border-[3px] border-foreground bg-card font-mono text-sm font-black shadow-[3px_3px_0_var(--foreground)] data-[active=true]:border-foreground data-[active=true]:ring-0"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <Button
          type="button"
          className="w-full rounded-none border-[3px] border-foreground bg-foreground font-mono text-xs font-black uppercase tracking-widest text-background shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] dark:hover:shadow-[2px_2px_0_#fff] hover:bg-foreground"
          onClick={handleVerify}
          disabled={verifyMutation.isPending || otp.length !== 6}
        >
          {verifyMutation.isPending ? 'Verifying...' : 'Verify →'}
        </Button>

        <div className="mt-2 text-center space-y-3 border-t-[3px] border-foreground pt-4">
          {!canResend ? (
            <p className="font-mono text-xs font-bold text-foreground">
              Resend in {formatTime(timer)}
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendMutation.isPending}
              className="border-[3px] border-foreground bg-violet-500 px-3 py-1 font-mono text-xs font-black uppercase tracking-wide text-white shadow-[3px_3px_0_var(--foreground)] hover:bg-foreground disabled:opacity-50"
            >
              Resend code
            </button>
          )}

          <div>
            <Link
              to="/register"
              className="font-mono text-xs font-bold text-foreground underline decoration-2 underline-offset-2 hover:bg-foreground hover:text-background"
            >
              Change email
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
