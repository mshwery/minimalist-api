import React from 'react'
import { useToasts } from './useToasts'

export type WithToastProps = ReturnType<typeof useToasts>

export function withToasts<Props extends WithToastProps>(
  Component: React.ComponentType<Props>
): React.ComponentType<Omit<Props, keyof WithToastProps>> {
  return (props: Omit<Props, keyof WithToastProps>) => {
    const { toasts, addToast } = useToasts()
    return <Component {...(props as Props)} toasts={toasts} addToast={addToast} />
  }
}
