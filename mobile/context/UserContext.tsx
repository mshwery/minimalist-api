import React, { useContext } from 'react'

export interface CurrentUser {
  id: string
  email: string
  image: string | null
  name: string | null
}

export interface Context {
  login: () => Promise<null | CurrentUser>
  logout: () => Promise<void> | void
  user: null | CurrentUser
}

export const defaultState = {
  login: async () => null,
  logout: () => {},
  user: null
}

export const UserContext = React.createContext<Context>(defaultState)

export function useCurrentUser() {
  return useContext(UserContext)
}
