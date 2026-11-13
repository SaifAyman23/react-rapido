import { useCallback, useState } from 'react'

/**
 * Pull-to-refresh state for a screen that owns its data.
 *
 * The app reads its data locally for now, so there is nothing to fetch and the
 * spinner settles straight away. The moment a screen reads from the API, the
 * handler passed here becomes that query's `refetch` and this hook stays
 * exactly as it is.
 */
export function useRefresh(onRefresh?: () => void | Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await onRefresh?.()
    } finally {
      setRefreshing(false)
    }
  }, [onRefresh])

  return { refreshing, refresh }
}
