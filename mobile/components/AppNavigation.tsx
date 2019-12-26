import React from 'react'
import { View } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { createStackNavigator, NavigationStackScreenProps } from 'react-navigation-stack'
import AuthLoadingScreen from './AuthLoadingScreen'
import IconButton from './IconButton'
import LoginScreen from './LoginScreen'
import Screen1 from './Screen1'
import Screen2 from './Screen2'
import Sidebar from './Sidebar'

const NavigationDrawerStructure: React.FC<{ navigation: NavigationStackScreenProps['navigation'] }> = ({ navigation }) => {
  return (
    <View style={{ flexDirection: 'row', marginLeft: 12 }}>
      <IconButton
        name='arrow-left'
        size={24}
        onPress={navigation.toggleDrawer}
      />
    </View>
  )
}

const DemoScreen1Navigator = createStackNavigator({
  Screen1: {
    screen: Screen1,
    navigationOptions: ({ navigation }) => ({
      title: 'Demo Screen 1',
      headerLeft: <NavigationDrawerStructure navigation={navigation} />,
      headerStyle: {
        backgroundColor: '#2e8ae6',
      },
      headerTintColor: '#fff',
    }),
  },
})

const DemoScreen2Navigator = createStackNavigator({
  Screen2: {
    screen: Screen2,
    navigationOptions: ({ navigation }) => ({
      title: 'Demo Screen 2',
      headerLeft: <NavigationDrawerStructure navigation={navigation} />,
      headerStyle: {
        backgroundColor: '#2e8ae6',
      },
      headerTintColor: '#fff',
    }),
  },
})

const AppStack = createDrawerNavigator({
  Screen1: {
    screen: DemoScreen1Navigator,
    navigationOptions: {
      drawerLabel: 'Demo Screen 1',
    },
  },
  Screen2: {
    screen: DemoScreen2Navigator,
    navigationOptions: {
      drawerLabel: 'Demo Screen 2',
    },
  }
}, {
  contentComponent: Sidebar,
  drawerPosition: 'left',
  edgeWidth: 60,
  minSwipeDistance: 20
})

const AuthStack = createStackNavigator({
  Login: LoginScreen
}, {
  headerMode: 'none'
})

export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  }, {
    initialRouteName: 'AuthLoading'
  })
)
