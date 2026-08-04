import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'

import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { APP_NAME } from '@/lib/constants'
import { queryClient } from '@/lib/queryClient'

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
