import { onCLS, onINP, onLCP, type Metric } from 'web-vitals'

declare global {
  interface Window {
    __vitals?: Record<string, number>
  }
}

function store(metric: Metric): void {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT
  if (endpoint) {
    navigator.sendBeacon(
      endpoint,
      JSON.stringify({ name: metric.name, value: metric.value, id: metric.id })
    )
    return
  }
  window.__vitals = { ...(window.__vitals ?? {}), [metric.name]: metric.value }
}

export function initWebVitals(): void {
  onCLS(store)
  onINP(store)
  onLCP(store)
}
