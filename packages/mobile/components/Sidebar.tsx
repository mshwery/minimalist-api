import React, { useState } from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'
import { useCurrentUser } from '../context/UserContext'
import { createDrawerIcon } from './DrawerIcon'
import CreateListModal from './CreateListModal'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 999,
    marginRight: 12,
  },
  names: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 13,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#C9CACF',
    paddingTop: 4,
    marginTop: 4,
  },
})

interface MenuItemProps extends React.ComponentProps<typeof DrawerItem> {
  iconName: string
  appearance?: 'primary' | 'secondary'
}

const MenuItem: React.FC<MenuItemProps> = ({ appearance = 'primary', iconName, ...props }) => {
  return <DrawerItem icon={iconName ? createDrawerIcon(iconName) : undefined} {...props} />
}

interface Props {
  drawerProps: DrawerContentComponentProps
  isLoading: boolean
  error?: null | any
  // onRequestCreateList: () => void
  refetchLists: () => Promise<any>
}

const Sidebar: React.FC<Props> = ({ drawerProps, error, refetchLists }) => {
  const { user, logout } = useCurrentUser()
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <>
      <DrawerContentScrollView {...drawerProps}>
        {user && (
          <>
            <View style={styles.user}>
              {user.image ? (
                <Image style={styles.avatar} source={{ uri: user.image }} />
              ) : (
                <View style={styles.avatar} />
              )}
              <View style={styles.names}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
                  {user.name}
                </Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.email}>
                  {user.email}
                </Text>
              </View>
            </View>
            <DrawerItemList {...drawerProps} />
            <MenuItem label="Create list" iconName="plus-circle" onPress={() => setShowCreateModal(true)} />
            <View style={styles.section}>
              {error ? (
                <MenuItem label="Loading error. Retry?" iconName="refresh-cw" onPress={() => refetchLists()} />
              ) : (
                <MenuItem label="Log out" iconName="log-out" appearance="secondary" onPress={logout} />
              )}
            </View>
          </>
        )}
      </DrawerContentScrollView>
      <CreateListModal isVisible={showCreateModal} onRequestClose={() => setShowCreateModal(false)} />
    </>
  )
}

export default Sidebar
