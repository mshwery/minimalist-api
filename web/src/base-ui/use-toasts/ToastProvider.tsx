import React from 'react'
import { ToastContainer } from './ToastContainer'
import { ToastWithID, Context, ToastContext } from './ToastContext'

interface ToastProviderProps {}

export function ToastProvider({ children }: React.PropsWithChildren<ToastProviderProps>): JSX.Element {
  const [toasts, setToasts] = React.useState<ToastWithID[]>([])
  const [isEngaged, setIsEngaged] = React.useState(false)

  const context: Context = React.useMemo(
    () => ({
      toasts,
      setToasts,
      isEngaged,
      setIsEngaged,
    }),
    [toasts, isEngaged]
  )

  return (
    <ToastContext.Provider value={context}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}
