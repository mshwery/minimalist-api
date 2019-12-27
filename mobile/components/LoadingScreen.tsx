import React from 'react'
import {
  ActivityIndicator,
  StatusBar,
  View,
  StyleSheet,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
})

const LoadingScreen: React.FC<{}> = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color='#2e8ae6' />
      <StatusBar barStyle='default' />
    </View>
  )
}

export default LoadingScreen
