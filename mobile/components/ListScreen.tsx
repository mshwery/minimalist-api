import React from 'react'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { ParamListBase, RouteProp } from '@react-navigation/native'
import { createDefaultDrawerToggle } from './DrawerIcon'
import List from './List'

const Stack = createStackNavigator()

interface ListScreenProps {
  route: RouteProp<{ List: { id: string; name: string } }, 'List'>
  navigation: StackNavigationProp<ParamListBase>
}

const ListScreen: React.FC<ListScreenProps> = ({ route }) => {
  return <List listId={route.params.id} listName={route.params.name} />
}

interface ListStackProps {
  route: RouteProp<{ ListStack: { id: string; name: string } }, 'ListStack'>
  navigation: DrawerNavigationProp<ParamListBase>
}

const ListStack: React.FC<ListStackProps> = ({ route, navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: createDefaultDrawerToggle(navigation.toggleDrawer),
        title: route.name,
      }}
    >
      <Stack.Screen name="List" component={ListScreen} initialParams={route.params} />
    </Stack.Navigator>
  )
}

export default ListStack
