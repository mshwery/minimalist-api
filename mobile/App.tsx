import React from 'react'
import { enableScreens } from 'react-native-screens'
import { ApolloProvider } from '@apollo/react-hooks'
import AppNavigation from './components/AppNavigation'
import { client } from './lib/apollo-client'

enableScreens()

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <AppNavigation />
      </ApolloProvider>
    )
  }
}
