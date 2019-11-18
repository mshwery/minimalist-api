import React, { useContext } from 'react'

const defaultState = {
  refetchUser: () => {},
  user: null
}

export interface Context {
  refetchUser: () => Promise<void> | void
  user: null | {
    email: string
    image: string
    name: string
  }
}

const context = React.createContext<Context>(defaultState)
const { Provider, Consumer } = context

export function useCurrentUser() {
  return useContext(context)
}

export { Provider, Consumer, defaultState }
