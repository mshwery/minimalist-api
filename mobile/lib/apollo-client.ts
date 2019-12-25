import ApolloClient from 'apollo-boost'
import { AsyncStorage } from 'react-native';

export const client = new ApolloClient({
  uri: 'https://ffe6c808.ngrok.io/graphql',
  request: async (operation) => {
    const token = await AsyncStorage.getItem('jwtToken')
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
  },
  onError: ({ networkError }) => {
    if (networkError && networkError.name === 'ServerParseError') {
      // @ts-ignore
      networkError.message = networkError.bodyText
    }
  }
})