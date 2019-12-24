import React, { useContext, useState, useEffect, useCallback } from 'react'
import { AuthSession } from 'expo'
import { AsyncStorage } from 'react-native'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

interface CurrentUser {
  id: string
  email: string
  image: string | null
  name: string | null
}

interface Context {
  login: () => Promise<any>
  logout: () => Promise<any>
  user: null | CurrentUser
}

const defaultState = {
  login: async () => {},
  logout: async () => {},
  user: null
}

const UserContext = React.createContext<Context>(defaultState)

export function useCurrentUser() {
  return useContext(UserContext)
}

async function signIn() {
  // Retrieve the redirect URL (should be in the allowed callback urls list)
  const redirectUrl = AuthSession.getRedirectUrl()
  console.log(`Redirect URL: ${redirectUrl}`)

  // Structure the auth parameters and URL
  const origin = 'https://4d0a170b.ngrok.io'
  const query = `redirect=${encodeURIComponent(redirectUrl)}`
  const authUrl = `${origin}/connect/google?${query}`

  // Perform the authentication
  const response = await AuthSession.startAsync({ authUrl })
  console.log('Authentication response', response)

  // TODO handle error
  if (response.type === 'success') {
    const jwtToken = response.params.token
    return jwtToken
  }

  return null
}

const GetCurrentUser = gql`
  query GetCurrentUser {
    me {
      id
      email
      image
      name
    }
  }
`

export const UserProvider: React.FC<{}> = ({ children }) => {
  const [context, setContext] = useState<Context>(defaultState)
  const { loading, data, error, refetch: refetchUser } = useQuery(GetCurrentUser)

  const login = useCallback(async () => {
    const jwtToken = await signIn()

    if (jwtToken) {
      await AsyncStorage.setItem('jwtToken', jwtToken)
    } else {
      await AsyncStorage.clear()
    }

    let user = null
    try {
      const response = await refetchUser()
      user = response.data.me
    } catch (error) {
      // TODO: handle error
    }

    setContext({ user, login, logout })
    return user
  }, [setContext, refetchUser])

  const logout = useCallback(async () => {
    await AsyncStorage.clear()
    setContext({
      user: null,
      login,
      logout
    })
  }, [setContext])

  // anytime the user query changes, reset the state
  useEffect(
    () => {
      setContext({
        user: data ? data.me : null,
        login,
        logout
      })
    },
    [loading, data, error]
  )

  if (loading) {
    return null
  }

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>
}
