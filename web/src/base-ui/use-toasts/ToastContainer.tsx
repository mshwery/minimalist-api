import React from 'react'
import { Pane } from '../Pane'
import { Portal } from '../Portal'
import { ToastContext } from './ToastContext'
import { ToastItem } from './ToastItem'

export function ToastContainer(): JSX.Element {
  const { toasts, isEngaged, setIsEngaged } = React.useContext(ToastContext)
  const timer = React.useRef<number | undefined>()

  const onHoverStart = React.useCallback(() => {
    clearTimeout(timer.current)
    setIsEngaged(true)
  }, [])

  const onHoverEnd = React.useCallback(() => {
    timer.current = window.setTimeout(() => {
      setIsEngaged(false)
      clearTimeout(timer.current)
    }, 200)
  }, [])

  return (
    <Portal>
      <Pane
        position="fixed"
        bottom={16}
        right={16}
        width={420}
        maxWidth="90vw"
        zIndex={2000}
        transition="all 400ms ease 0s"
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        {toasts.map((toast, index) => (
          <ToastItem
            key={`toast-${toast.id || index}`}
            index={index}
            total={toasts.length}
            toast={toast}
            isEngaged={isEngaged}
          />
        ))}
      </Pane>
    </Portal>
  )
}
