import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useToastContext } from './ToastContext'
import type { Toast, ToastWithID } from './ToastContext'

type AddToastFn = (toast: Toast) => void

const defaultDelay = 2000

export function useToasts(): { toasts: ToastWithID[]; addToast: AddToastFn } {
  const { toasts, isEngaged, setToasts } = useToastContext()
  const engagement = React.useRef<boolean>(isEngaged)

  // Keep `isEngaged` in a ref to use within our timer
  React.useEffect(() => {
    engagement.current = isEngaged
  }, [isEngaged])

  const addToast = React.useCallback(
    (toast: Toast): void => {
      const id = uuidv4()
      const delay = toast.delay ?? defaultDelay

      const cancel = (id: string, _delay: number) => {
        setToasts((currentToasts) => {
          return currentToasts.map((toast) => {
            if (toast.id === id) return { ...toast, dismissing: true }
            return toast
          })
        })

        // Wait a hot second before removing from the set
        window.setTimeout(() => {
          setToasts((currentToasts) => {
            return currentToasts.filter((toast) => toast.id !== id)
          })
        }, delay * 2)
      }

      // Append toast to current set
      setToasts((currentToasts) => {
        const newToast = { ...toast, delay, id }
        return [...currentToasts, newToast]
      })

      // Recursively check to dismiss the toast, if not hovering
      const hideToast = (id: string, delay: number) => {
        const hideTimer = window.setTimeout(() => {
          // Recurse when currently interacting with toasts
          if (engagement.current) {
            hideToast(id, delay)
            return clearTimeout(hideTimer)
          }

          cancel(id, delay)
          clearTimeout(hideTimer)
        }, delay)
      }

      hideToast(id, delay)
    },
    [toasts, setToasts]
  )

  return { toasts, addToast }
}
