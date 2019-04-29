import React from 'react'

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

const { Provider, Consumer } = React.createContext<Context>(defaultState)

export { Provider, Consumer, defaultState }
