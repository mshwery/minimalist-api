import ApolloClient from 'apollo-boost'
import { AsyncStorage } from 'react-native';

export const client = new ApolloClient({
  uri: 'https://4d0a170b.ngrok.io/graphql',
  request: async (operation) => {
    const token = await AsyncStorage.getItem('jwtToken')
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
  }
})
