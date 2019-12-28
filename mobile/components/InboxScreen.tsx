import React from 'react'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { ParamListBase } from '@react-navigation/native'
import { createDefaultDrawerToggle } from './DrawerIcon'
import List from './List'

const Stack = createStackNavigator()

interface Props {
  navigation: DrawerNavigationProp<ParamListBase>
}

const InboxScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{
      headerLeft: createDefaultDrawerToggle(navigation.toggleDrawer)
    }}>
      <Stack.Screen name='Inbox' component={() => (
        <List listId='inbox' listName='Inbox' />
      )} />
    </Stack.Navigator>
  )
}

export default InboxScreen
