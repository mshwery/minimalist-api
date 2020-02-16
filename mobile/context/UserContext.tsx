import React, { useContext } from 'react'

export interface CurrentUser {
  id: string
  email: string
  image: string | null
  name: string | null
}

export interface Context {
  login: () => Promise<null | CurrentUser>
  logout: () => Promise<any>
  user: null | CurrentUser
}

export const defaultState = {
  login: async () => null,
  logout: async () => {},
  user: null
}

export const UserContext = React.createContext<Context>(defaultState)

export function useCurrentUser() {
  return useContext(UserContext)
}
