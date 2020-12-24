import React from 'react'
import { Feather } from '@expo/vector-icons'
import IconButton from './IconButton'

export function createDrawerIcon(iconName: string, iconSize = 20) {
  return (props) => <Feather name={iconName} size={iconSize} color={props.color} style={{ marginRight: -12 }} />
}

export function createDefaultDrawerToggle(toggleDrawer) {
  return () => <IconButton name="arrow-left" size={24} onPress={toggleDrawer} style={{ marginLeft: 8 }} />
}
