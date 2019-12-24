import React from 'react'
import { View, StyleSheet, SafeAreaView, Image, Text, TouchableOpacity, AsyncStorage } from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'
import { ScrollView } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { UserProvider, useCurrentUser } from './UserContext'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 999,
    marginRight: 12
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  email: {
    fontSize: 14
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#daddad',
    marginTop: 4,
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 14,
    color: 'gray'
  }
})

const Sidebar: React.FC<any> = (props) => {
  const { user, logout } = useCurrentUser()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {user && (
          <>
            <View style={styles.user}>
              {user.image
                ? <Image style={styles.avatar} source={{ uri: user.image }} />
                : <View style={styles.avatar} />
              }
              <View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
              </View>
            </View>
            <DrawerItems {...props} />
            <TouchableOpacity style={[styles.section, styles.menuItem]} onPress={async () => {
              await logout()
              props.navigation.navigate('Auth')
            }}>
              <Feather name='log-out' size={20} color='gray' />
              <Text style={[styles.menuItemText, { marginLeft: 12 }]}>
                Log out
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Sidebar
