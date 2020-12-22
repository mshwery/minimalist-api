import React from 'react'
import { StyleSheet, Button, View, Text } from 'react-native'
import { ParamListBase } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import LogoMark from '../assets/logomark.svg'
import { lineHeight } from '../lib/line-height'
import { useCurrentUser } from '../context/UserContext'

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
    lineHeight: lineHeight(18, 1.4),
  },
})

interface Props {
  navigation: StackNavigationProp<ParamListBase>
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useCurrentUser()

  return (
    <View style={styles.container}>
      <LogoMark />
      <Text style={styles.description}>The simplest way to keep track of the stuff you want to do.</Text>
      <Button
        title="Sign in with Google"
        onPress={async () => {
          const user = await login()
          if (user) {
            navigation.navigate('App')
          }
        }}
      />
    </View>
  )
}

export default LoginScreen
