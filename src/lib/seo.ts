import { APP_NAME } from '@/lib/constants'

export const SITE_NAME = import.meta.env.VITE_APP_NAME || APP_NAME
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://saifayman23.github.io/portfolio/'
).replace(/\/+$/, '')

export const DEFAULT_TITLE = `${SITE_NAME} · Full-Stack Engineer`
export const DEFAULT_DESCRIPTION =
  'Full-stack engineer building production-grade products end to end. Django APIs, real-time systems, and React interfaces.'

interface RouteSeo {
  title: string
  description: string
}

export const ROUTE_SEO: Record<string, RouteSeo> = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  '/login': {
    title: `Sign in · ${SITE_NAME}`,
    description: `Sign in to your ${SITE_NAME} account.`,
  },
  '/register': {
    title: `Create an account · ${SITE_NAME}`,
    description: `Create a new ${SITE_NAME} account in seconds.`,
  },
  '/forgot-password': {
    title: `Reset password · ${SITE_NAME}`,
    description: `Reset your ${SITE_NAME} password.`,
  },
  '/verify-otp': {
    title: `Verify your identity · ${SITE_NAME}`,
    description: `Enter the one-time code sent to your inbox.`,
  },
  '/reset-password': {
    title: `Set a new password · ${SITE_NAME}`,
    description: `Choose a new password for your ${SITE_NAME} account.`,
  },
}

export function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^${escaped.replace(/\\:(\w+)/g, '[^/]+')}/?$`)
}

export function matchRouteSeo(pathname: string): RouteSeo {
  const exact = ROUTE_SEO[pathname]
  if (exact) return exact

  for (const [pattern, seo] of Object.entries(ROUTE_SEO)) {
    if (pattern.includes(':') && patternToRegex(pattern).test(pathname)) {
      return seo
    }
  }

  return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION }
}

export function getOgImage(): string {
  return `${SITE_URL}/logo.webp`
}
