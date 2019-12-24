import React from 'react'
import { StyleSheet, Button, View, AsyncStorage, Text, Alert } from 'react-native'
import { AuthSession } from 'expo'
import LogoMark from '../assets/logomark.svg'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { lineHeight } from '../lib/line-height'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    marginTop: 16,
    marginBottom: 32,
    maxWidth: 300,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: lineHeight(18, 1.4)
  }
})

class LoginScreen extends React.Component<NavigationStackScreenProps> {
  render() {
    return (
      <View style={styles.container}>
        <LogoMark />
        <Text style={styles.description}>
          The simplest way to keep track of the stuff you want to do.
        </Text>
        <Button title='Sign in with Google' onPress={this.signIn} />
      </View>
    )
  }

  // private signIn = () => Linking.openURL(`https://4d0a170b.ngrok.io/connect/google?redirect=${encodeURIComponent(Linking.makeUrl('login'))}`)
  private signIn = async () => {
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
      this.handleResponse(response.params)
    }
  }

  private handleResponse = (response) => {
    if (response.error) {
      Alert.alert('Authentication error', response.error_description || 'something went wrong')
      return
    }

    const jwtToken = response.token
    if (jwtToken) {
      void AsyncStorage.setItem('jwtToken', jwtToken).then(() => {
        this.props.navigation.navigate('App')
      })
    }
  }
}

export default LoginScreen
