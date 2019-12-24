import React from 'react'
import { StyleSheet, View, Text, Button, AsyncStorage } from 'react-native'
import { NavigationStackScreenProps } from 'react-navigation-stack'

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'center',
  },
})

export default class Screen1 extends React.Component<NavigationStackScreenProps> {
  render() {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ fontSize: 22 }}>Screen 1</Text>
        <Button title='Log out' onPress={this.signOut} />
      </View>
    )
  }

  private signOut = async () => {
    await AsyncStorage.clear()
    this.props.navigation.navigate('Auth')
  }
}
