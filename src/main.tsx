import { useGSAP } from '@gsap/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'

import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { APP_NAME } from '@/lib/constants'
import { queryClient } from '@/lib/queryClient'
import { initWebVitals } from '@/lib/vitals'

// Register once at startup: lazy chunks create triggers, so registration
// must live in the entry — never only in the chunks themselves.
gsap.registerPlugin(useGSAP, Observer, ScrollTrigger, SplitText)

initWebVitals()

const skeleton = document.getElementById('loading-skeleton')
if (skeleton) {
  skeleton.style.opacity = '0'
  setTimeout(() => skeleton.remove(), 300)
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey={`${APP_NAME}-theme`}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
