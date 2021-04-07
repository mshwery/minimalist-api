import React from 'react'
import { Card } from '../Card'
import { Text } from '../Text'
import type { ToastWithID } from './ToastContext'

const maxHeight = 75

interface ToastProps {
  index: number
  total: number
  toast: ToastWithID
  isEngaged?: boolean
}

export function ToastItem({ toast, index, total, isEngaged }: ToastProps): JSX.Element | null {
  const [visible, setVisible] = React.useState(false)
  const [hide, setHide] = React.useState(false)

  // Appearing transition
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
      clearTimeout(timer)
    }, 10)
    return () => clearTimeout(timer)
  }, [])

  const reverseIndex = React.useMemo(() => total - (index + 1), [total, index])

  const transform = React.useMemo(() => {
    let translate = 'translate3d(0, 0, 0)'
    let scale = 'scale(1)'

    if (!visible) {
      return `${translate} ${scale}`
    }

    if (reverseIndex >= 4) {
      translate = `translate3d(0, -${maxHeight}px, -${reverseIndex}px)`
      scale = `scale(0.7)`
    } else if (isEngaged) {
      translate = `translate3d(0, ${reverseIndex * -maxHeight}px, -${reverseIndex}px)`
      scale = `scale(${total === 1 ? 1 : 0.98205})`
    } else {
      translate = `translate3d(0, calc(100% + -${maxHeight}px + -${20 * reverseIndex}px), -${reverseIndex}px)`
      scale = `scale(${1 - 0.05 * reverseIndex})`
    }

    return `${translate} ${scale}`
  }, [visible, isEngaged, index, total, reverseIndex])

  // Prepare toast for destruction!
  React.useEffect(() => {
    const shouldHide = reverseIndex > 2 || toast.dismissing
    if (!shouldHide) return

    const timer = setTimeout(() => {
      setHide(true)
      clearTimeout(timer)
    }, 150)

    return () => {
      clearTimeout(timer)
    }
  }, [reverseIndex, toast.dismissing])

  // No need to render really stale toasts
  if (reverseIndex > 10) return null

  return (
    <Card
      key={`${toast.id}-${index}`}
      position="absolute"
      bottom={0}
      right={0}
      width="100%"
      maxHeight={maxHeight}
      elevation={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding={16}
      opacity={hide ? 0 : visible ? 1 : 0}
      visibility={hide ? 'hidden' : 'visible'}
      pointerEvents={hide ? 'none' : undefined}
      transform={transform}
      transition="transform 400ms ease 0ms, visibility 200ms ease 0ms, opacity 200ms ease 0ms"
    >
      <Text>{toast.text}</Text>
    </Card>
  )
}
