import React from 'react'
import { enableScreens } from 'react-native-screens'
import { NavigationNativeContainer } from '@react-navigation/native'
import { ApolloProvider } from '@apollo/react-hooks'
import AppNavigation from './components/AppNavigation'
import { client } from './lib/apollo-client'
import { UserProvider } from './components/UserProvider'

enableScreens()

export default class App extends React.Component {
  render() {
    return (
      <NavigationNativeContainer>
        <ApolloProvider client={client}>
          <UserProvider>
            <AppNavigation />
          </UserProvider>
        </ApolloProvider>
      </NavigationNativeContainer>
    )
  }
}
