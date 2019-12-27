import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { ParamListBase, useRoute, RouteProp } from '@react-navigation/native'
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

const List: React.FC<{}> = () => {
  const route = useRoute<RouteProp<{ List: { id: string, name: string } }, 'List'>>()

  return (
    <View style={styles.MainContainer}>
      <Text style={{ fontSize: 22 }}>List View</Text>
      <Text>{route.params.name}</Text>
      <Text>{route.params.id}</Text>
    </View>
  )
}

const Stack = createStackNavigator()

interface Props {
  navigation: DrawerNavigationProp<ParamListBase>
}

const ListScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute()

  return (
    <Stack.Navigator screenOptions={{
      headerLeft: createDefaultDrawerToggle(navigation.toggleDrawer),
      title: route.name
    }}>
      <Stack.Screen name='List' component={List} initialParams={route.params} />
    </Stack.Navigator>
  )
}

export default ListScreen
