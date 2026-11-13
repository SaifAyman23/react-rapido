import type { AuthTokens } from '@/api/contracts'

const SESSION_KEY = 'rapido.session'

interface Session {
  access: string
  refresh: string
}

let session: Session | null = null
let loaded = false

function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.access === 'string' && typeof candidate.refresh === 'string'
}

function read(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (isSession(parsed)) return parsed
    localStorage.removeItem(SESSION_KEY)
    return null
  } catch {
    return null
  }
}

/** Restore the persisted pair once at app start. */
export function loadSession(): Session | null {
  if (!loaded) {
    session = read()
    loaded = true
  }
  return session
}

export function getAccessToken(): string | null {
  return loadSession()?.access ?? null
}

export function getRefreshToken(): string | null {
  return loadSession()?.refresh ?? null
}

export function hasSession(): boolean {
  return loadSession() !== null
}

function save(next: Session): void {
  session = next
  loaded = true
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(next))
  } catch {
    // Storage can be unavailable in private mode; the in-memory pair still works.
  }
}

/** Persist the token pair returned by login/verify/social. */
export function saveAuthSession(tokens: AuthTokens): void {
  save({ access: tokens.access, refresh: tokens.refresh })
}

/** Store a rotated access token, and the rotated refresh token when issued. */
export function updateAccessToken(access: string, refresh?: string): void {
  const current = loadSession()
  if (!current) return
  save({ access, refresh: refresh ?? current.refresh })
}

export function clearSession(): void {
  session = null
  loaded = true
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // Nothing to clear.
  }
}
