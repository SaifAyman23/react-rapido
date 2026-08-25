import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { extractErrorMessage } from '@/api/axiosInstance'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormError } from '@/components/auth/FormError'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success] = useState(location.state?.message || '')
  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate('/')
        },
        onError: (error: unknown) => {
          setError(extractErrorMessage(error, 'Login failed'))
        },
      }
    )
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue — clean, fast.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />
        {success && !error && (
          <div className="border-[3px] border-black bg-emerald-50 px-3 py-2 font-mono text-xs font-bold text-emerald-700">
            {success}
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="font-mono text-xs font-black uppercase tracking-wide text-black"
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
            className="rounded-none border-[3px] border-black bg-white font-mono text-sm shadow-[3px_3px_0_#000] focus-visible:ring-black"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="font-mono text-xs font-black uppercase tracking-wide text-black"
            >
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="font-mono text-xs font-bold text-black underline decoration-2 underline-offset-2 hover:bg-black hover:text-white hover:decoration-black"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="rounded-none border-[3px] border-black bg-white pr-10 font-mono text-sm shadow-[3px_3px_0_#000] focus-visible:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 border-[2px] border-black bg-white p-1 hover:bg-black hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-none border-[3px] border-black bg-black font-mono text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] hover:bg-black"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign in →'}
        </Button>
      </form>

      <p className="mt-6 text-center font-mono text-xs font-bold text-black">
        No account?{' '}
        <Link
          to="/register"
          className="border-b-[3px] border-black bg-[#8B5CF6] px-1 py-0.5 text-white hover:bg-black hover:text-white"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
