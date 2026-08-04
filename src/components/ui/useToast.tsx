import { useState, useCallback } from 'react'

import type { ToastType, ToastAlignment, ToastProps } from './toast'

interface ToastOptions {
  message: string
  type?: ToastType
  alignment?: ToastAlignment
  dismissible?: boolean
  /** Auto-dismiss after ms. Set to 0 to disable. @default 2500 */
  duration?: number
}

export function useToast() {
  const [state, setState] = useState<(ToastOptions & { open: boolean }) | null>(null)

  const show = useCallback((opts: ToastOptions) => {
    const duration = opts.duration ?? 2500
    setState({ ...opts, open: true })
    if (duration > 0) {
      setTimeout(() => setState((s) => (s ? { ...s, open: false } : s)), duration)
    }
  }, [])

  const hide = useCallback(() => {
    setState((s) => (s ? { ...s, open: false } : s))
  }, [])

  const toastProps: ToastProps = {
    open: state?.open ?? false,
    message: state?.message ?? '',
    type: state?.type,
    alignment: state?.alignment,
    dismissible: state?.dismissible,
    onClose: hide,
  }

  return { show, hide, toastProps }
}
