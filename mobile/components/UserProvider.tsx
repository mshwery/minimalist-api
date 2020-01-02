import React, { useState, useEffect, useCallback } from 'react'
import { AuthSession } from 'expo'
import { AsyncStorage } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import LoadingScreen from './LoadingScreen'
import LoginScreen from './LoginScreen'
import { Context, defaultState, UserContext } from '../context/UserContext'

async function signIn() {
  // Retrieve the redirect URL (should be in the allowed callback urls list)
  const redirectUrl = AuthSession.getRedirectUrl()
  console.log(`Redirect URL: ${redirectUrl}`)

  // Structure the auth parameters and URL
  const origin = 'https://5a1f9651.ngrok.io'
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

const AuthStack = createStackNavigator()

const clearAppKeys = async () => {
  const keys = await AsyncStorage.getAllKeys()
  if (keys.length > 0) {
    await AsyncStorage.multiRemove(keys)
  }
}

export const UserProvider: React.FC<{}> = ({ children }) => {
  const [context, setContext] = useState<Context>(defaultState)
  const { loading, data, error, refetch: refetchUser } = useQuery(GetCurrentUser)

  const login = useCallback(async () => {
    const jwtToken = await signIn()

    if (jwtToken) {
      await AsyncStorage.setItem('jwtToken', jwtToken)
    } else {
      await clearAppKeys()
    }

    let user = null
    try {
      if (jwtToken) {
        const response = await refetchUser()
        user = response.data.me
      }
    } catch (error) {
      // TODO: handle error
    }

    setContext({ user, login, logout })
    return user
  }, [setContext, refetchUser])

  const logout = useCallback(async () => {
    await clearAppKeys()
    setContext({
      user: null,
      login,
      logout
    })
  }, [setContext])

  // anytime the user query changes, reset the state
  useEffect(
    () => {
      let user = null

      if (data) {
        user = data.me
      }

      if (error) {
        void logout()
      } else {
        setContext({ user, login, logout })
      }
    },
    [loading, data, error]
  )

  return (
    <UserContext.Provider value={context}>
      <AuthStack.Navigator headerMode='none'>
        {loading ? (
          // We haven't finished checking for the token yet
          <AuthStack.Screen name='Splash' component={LoadingScreen} />
        ) : context.user === null ? (
          // User isn't signed in
          <AuthStack.Screen name='Log In' component={LoginScreen} />
        ) : (
          // User is signed in, so return child routes/components
          <AuthStack.Screen name='App' component={() => <>{children}</>} />
        )}
      </AuthStack.Navigator>
    </UserContext.Provider>
  )
}
