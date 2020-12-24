import React, { useContext } from 'react'

const defaultState = {
  refetchUser: (): void => undefined,
  user: null,
}

export interface Context {
  refetchUser: () => Promise<void> | void
  user: null | {
    id: string
    email: string
    image: string
    name: string
  }
}

const context = React.createContext<Context>(defaultState)
const { Provider, Consumer } = context

export function useCurrentUser(): Context {
  return useContext(context)
}

export { Provider, Consumer, defaultState }
