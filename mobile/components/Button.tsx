import React from 'react'
import { StyleSheet, View, Vibration, Text } from 'react-native'
import Touchable from 'react-native-platform-touchable'
import { Feather } from '@expo/vector-icons'
import { pickBy, omitBy } from 'lodash'

const styles = StyleSheet.create({
  Container: {
    borderRadius: 8,
  },
  Inner: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#2e8ae6',
    color: 'white',
    fontSize: 15,
    minHeight: 32,
  },
  Disabled: {
    backgroundColor: '#A6B1BB',
  },
})

interface Props {
  disabled?: boolean
  iconAfter?: string
  iconBefore?: string
  style?: any
  text: string
  withHapticFeedback?: boolean
}

const Button: React.FC<React.ComponentProps<typeof Touchable> & Props> = ({
  disabled,
  iconAfter,
  iconBefore,
  style = {},
  text,
  withHapticFeedback,
  onPress,
  ...props
}) => {
  const allStyles = StyleSheet.flatten([styles.Button, style])
  const innerStyles = omitBy(allStyles, (_, key) => key.startsWith('margin'))
  const outerStyles = pickBy(allStyles, (_, key) => key.startsWith('margin') || key === 'borderRadius')
  const { color, fontSize } = innerStyles
  const iconSize = Math.trunc((fontSize || 15) * 1.25)

  return (
    <View style={[{ borderRadius: 8, overflow: 'hidden' }, outerStyles]}>
      <Touchable
        style={[styles.Container, styles.Button, innerStyles, disabled && styles.Disabled]}
        {...props}
        onPress={disabled ? undefined : onPress}
        onPressIn={() => (withHapticFeedback ? Vibration.vibrate(3) : undefined)}
      >
        <View style={styles.Inner}>
          {iconBefore && <Feather name={iconBefore} size={iconSize} color={color} style={{ marginRight: 12 }} />}
          <Text style={{ color, fontSize }}>{text}</Text>
          {iconBefore && <Feather name={iconAfter} size={iconSize} color={color} style={{ marginLeft: 12 }} />}
        </View>
      </Touchable>
    </View>
  )
}

export default Button
