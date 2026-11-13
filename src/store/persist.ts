const KEY_PREFIX = 'rapido.'

/** localStorage key for one persisted client store. */
export const persistKey = (key: string) => `${KEY_PREFIX}${key}`

export function persistGet(key: string): unknown {
  try {
    const raw = localStorage.getItem(persistKey(key))
    if (raw === null) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function persistSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(persistKey(key), JSON.stringify(value))
  } catch {
    // Storage can be unavailable; the in-memory value still applies.
  }
}
