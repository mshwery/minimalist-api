import React from 'react'
import { View, StyleSheet, ScrollView, Image, Text, TouchableNativeFeedback } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { DrawerItems } from 'react-navigation-drawer'
import { Feather } from '@expo/vector-icons'
import { useCurrentUser } from './UserContext'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 999,
    marginRight: 12
  },
  names: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 13
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#C9CACF',
    paddingTop: 4,
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 14,
    color: '#787A87'
  }
})

const Sidebar: React.FC<any> = (props) => {
  const { user, logout } = useCurrentUser()

  return (
    <ScrollView>
      <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
        {user && (
          <>
            <View style={styles.user}>
              {user.image
                ? <Image style={styles.avatar} source={{ uri: user.image }} />
                : <View style={styles.avatar} />
              }
              <View style={styles.names}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.name}>{user.name}</Text>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.email}>{user.email}</Text>
              </View>
            </View>
            <DrawerItems {...props} />
            <View style={styles.section}>
              {/* <Text>{Object.keys(props).join(',\n')}</Text>
              <Text>{JSON.stringify(props.items, null, 2)}</Text> */}
              <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={async () => {
                await logout()
                props.navigation.navigate('Auth')
              }}>
                <View style={styles.menuItem}>
                  <Feather name='log-out' size={20} color='gray' />
                  <Text style={[styles.menuItemText, { marginLeft: 12 }]}>
                    Log out
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </>
        )}
      </SafeAreaView>
    </ScrollView>
  )
}

export default Sidebar
