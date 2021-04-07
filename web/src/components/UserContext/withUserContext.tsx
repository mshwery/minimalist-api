import React from 'react'
import { useCurrentUser } from './context'

export type WithUserProps = ReturnType<typeof useCurrentUser>

export function withUserContext<Props extends WithUserProps>(
  Component: React.ComponentType<Props>
): React.ComponentType<Omit<Props, keyof WithUserProps>> {
  return (props: Omit<Props, keyof WithUserProps>) => {
    const context = useCurrentUser()
    return <Component {...context} {...(props as Props)} />
  }
}
