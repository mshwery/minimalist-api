import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  StyleSheet,
} from 'react-native'
import { NavigationSwitchScreenProps } from 'react-navigation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
})

class AuthLoadingScreen extends React.Component<NavigationSwitchScreenProps> {
  componentDidMount() {
    void this.checkSession()
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#2e8ae6' />
        <StatusBar barStyle='default' />
      </View>
    )
  }

  // Fetch the token from storage then navigate to our appropriate place
  private checkSession = async () => {
    const loggedIn = await AsyncStorage.getItem('jwtToken')

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(loggedIn ? 'App' : 'Auth')
  }
}

export default AuthLoadingScreen
