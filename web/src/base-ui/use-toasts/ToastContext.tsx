import React from 'react'

export interface Toast {
  text: string
  delay?: number
}

export interface ToastWithID extends Toast {
  id: string
  dismissing?: boolean
}

export interface Context {
  toasts: ToastWithID[]
  setToasts: React.Dispatch<React.SetStateAction<ToastWithID[]>>
  isEngaged: boolean
  setIsEngaged: (isEngaged: boolean) => void
}

const defaultContext: Context = {
  toasts: [],
  setToasts: () => [],
  isEngaged: false,
  setIsEngaged: () => {
    /* noop */
  },
}

export const ToastContext = React.createContext<Context>(defaultContext)

export function useToastContext(): Context {
  return React.useContext(ToastContext)
}
