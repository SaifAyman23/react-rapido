import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey={`${APP_NAME}-theme`}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
