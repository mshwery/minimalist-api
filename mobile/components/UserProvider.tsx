import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { AuthSession } from 'expo'
import { AsyncStorage, Alert } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Context, UserContext } from '../context/UserContext'
import { API_URL } from '../config'
import LoadingScreen from './LoadingScreen'
import LoginScreen from './LoginScreen'

async function signIn() {
  // Retrieve the redirect URL (should be in the allowed callback urls list)
  const redirectUrl = AuthSession.getRedirectUrl()
  console.log(`Redirect URL: ${redirectUrl}`)

  // Structure the auth parameters and URL
  const query = `redirect=${encodeURIComponent(redirectUrl)}`
  const authUrl = `${API_URL}/connect/google?${query}`

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
  const [user, setUser] = useState<Context['user']>(null)
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

    setUser(user)
    return user
  }, [setUser, refetchUser])

  const logout = useCallback(async () => {
    await clearAppKeys()
    setUser(null)
  }, [setUser])

  const requestLogout = useCallback(() => {
    Alert.alert('', 'Log out of minimalist?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logout() },
    ])
  }, [logout])

  // anytime the user query changes, reset the state
  useEffect(() => {
    let user = null

    if (data) {
      user = data.me
    }

    if (error) {
      void logout() // directly logout (no prompt)
    } else {
      setUser(user)
    }
  }, [loading, data, error])

  const context: Context = useMemo(() => ({ user, login, logout: requestLogout }), [user, login, requestLogout])

  return (
    <UserContext.Provider value={context}>
      <AuthStack.Navigator headerMode="none">
        {loading ? (
          // We haven't finished checking for the token yet
          <AuthStack.Screen name="Splash" component={LoadingScreen} />
        ) : context.user === null ? (
          // User isn't signed in
          <AuthStack.Screen name="Log In" component={LoginScreen} />
        ) : (
          // User is signed in, so return child routes/components
          <AuthStack.Screen name="App" component={() => <>{children}</>} />
        )}
      </AuthStack.Navigator>
    </UserContext.Provider>
  )
}
