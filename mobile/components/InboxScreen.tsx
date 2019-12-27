import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import IconButton from './IconButton'
import { ParamListBase } from '@react-navigation/native'
import { createDefaultDrawerToggle } from './DrawerIcon'

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'center',
  },
})

const Inbox: React.FC<{}> = () => {
  return (
    <View style={styles.MainContainer}>
      <Text style={{ fontSize: 22 }}>Inbox</Text>
    </View>
  )
}

const Stack = createStackNavigator()

interface Props {
  navigation: DrawerNavigationProp<ParamListBase>
}

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{
      headerLeft: createDefaultDrawerToggle(navigation.toggleDrawer)
    }}>
      <Stack.Screen name='Inbox' component={Inbox} />
    </Stack.Navigator>
  )
}

export default InboxScreen
