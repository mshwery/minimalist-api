import ApolloClient from 'apollo-boost'
import { AsyncStorage } from 'react-native'
import { API_URL } from '../config'

export const client = new ApolloClient({
  uri: `${API_URL}/graphql`,
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
