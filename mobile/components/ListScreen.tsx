import React from 'react'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { ParamListBase, RouteProp } from '@react-navigation/native'
import { createDefaultDrawerToggle } from './DrawerIcon'
import List from './List'

const Stack = createStackNavigator()

interface Props {
  route: RouteProp<{ List: { id: string, name: string }}, 'List'>
  navigation: DrawerNavigationProp<ParamListBase>
}

const ListScreen: React.FC<Props> = ({ route, navigation }) => {
  return (
    <Stack.Navigator screenOptions={{
      headerLeft: createDefaultDrawerToggle(navigation.toggleDrawer),
      title: route.name
    }}>
      <Stack.Screen name='List' component={() => (
        <List listId={route.params.id} listName={route.params.name} />
      )} />
    </Stack.Navigator>
  )
}

export default ListScreen
