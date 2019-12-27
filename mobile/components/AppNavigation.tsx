import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InboxScreen from './InboxScreen'
import ListScreen from './ListScreen'
import LoadingScreen from './LoadingScreen'
import Sidebar from './Sidebar'
import { createDrawerIcon } from './DrawerIcon'

const GetLists = gql`
  query GetLists {
    lists(status: ACTIVE) {
      id
      name
    }
  }
`

const Drawer = createDrawerNavigator()

const AppNavigation: React.FC<{}> = () => {
  // Fetch user's lists, so we can construct the sidebar navigation
  const { loading, data, error, refetch } = useQuery(GetLists)

  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar drawerProps={props} isLoading={loading} error={error} refetchLists={refetch} />}
      drawerContentOptions={{
        itemStyle: {
          marginTop: 0
        }
      }}
      edgeWidth={60}
      minSwipeDistance={20}
    >
      {loading || error ? (
        // We haven't finished fetching lists yet
        <Drawer.Screen name='Splash' component={LoadingScreen} />
      ) : (
        <>
          <Drawer.Screen
            name='Inbox'
            component={InboxScreen}
            options={{
              drawerIcon: createDrawerIcon('inbox')
            }}
            initialParams={{
              id: 'inbox',
              name: 'Inbox'
            }}
          />
          {data.lists.map(list => (
            <Drawer.Screen
              key={list.id}
              name={list.name}
              component={ListScreen}
              options={{
                drawerIcon: createDrawerIcon('menu')
              }}
              initialParams={{
                id: list.id,
                name: list.name
              }}
            />
          ))}
        </>
      )}
    </Drawer.Navigator>
  )
}

export default AppNavigation
