import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useCurrentUser } from './UserContext'

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'center',
  },
})

const Screen1: React.FC<NavigationStackScreenProps> = (props) => {
  const { logout } = useCurrentUser()

  return (
    <View style={styles.MainContainer}>
      <Text style={{ fontSize: 22 }}>Screen 1</Text>
      <Button title='Log out' onPress={async () => {
        await logout()
        props.navigation.navigate('Auth')
      }} />
    </View>
  )
}

export default Screen1
