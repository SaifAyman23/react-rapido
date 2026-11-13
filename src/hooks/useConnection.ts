import { useCallback, useEffect, useState } from 'react'

/**
 * What the network check is allowed to say.
 *
 * `auto` follows the browser. `offline` and `online` force the answer, so the
 * offline screen can be worked on from a machine that is online, and the app
 * can be developed on a machine that is not.
 */
export type NetworkMode = 'auto' | 'offline' | 'online'

export interface Connection {
  /** `null` until the browser has answered. `false` means there is no network. */
  isConnected: boolean | null
  /** Asks the browser again. Used by the retry action. */
  retry: () => void
  /** What the check is currently allowed to say. */
  mode: NetworkMode
}

const ENV_MODE = (import.meta.env.VITE_NETWORK_CHECK ?? 'auto') as NetworkMode

/** A browser that never fires an online/offline event is assumed connected. */
const UNKNOWN_TIMEOUT_MS = 4000

export function resolveConnection(
  mode: NetworkMode,
  deviceIsConnected: boolean | null
): boolean | null {
  if (mode === 'offline') return false
  if (mode === 'online') return true
  return deviceIsConnected
}

export function useConnection(): Connection {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [assumeConnected, setAssumeConnected] = useState(false)

  useEffect(() => {
    const update = () => setIsConnected(navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    const timer = window.setTimeout(() => setAssumeConnected(true), UNKNOWN_TIMEOUT_MS)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
      window.clearTimeout(timer)
    }
  }, [])

  const retry = useCallback(() => {
    setIsConnected(navigator.onLine)
  }, [])

  const deviceIsConnected = isConnected ?? (assumeConnected ? true : null)
  const mode: NetworkMode = import.meta.env.DEV ? ENV_MODE : 'auto'

  return { isConnected: resolveConnection(mode, deviceIsConnected), retry, mode }
}
