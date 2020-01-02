import React from 'react'
import { View, Vibration } from 'react-native'
import Touchable from 'react-native-platform-touchable'
import { Feather } from '@expo/vector-icons'

interface Props {
  color?: string
  name: string
  size: number
  style?: any
  withHapticFeedback?: boolean
}

const IconButton: React.FC<React.ComponentProps<typeof Touchable> & Props> = ({
  color = '#242527',
  name,
  size,
  style = {},
  withHapticFeedback,
  ...props
}) => {
  return (
    <View style={[{ borderRadius: 999, overflow: 'hidden' }, style]}>
      <Touchable
        background={Touchable.Ripple('#a3cdf7', true)}
        style={{ borderRadius: 999, padding: Math.round(size * .4) }}
        {...props}
        onPressIn={() => withHapticFeedback ? Vibration.vibrate(3) : undefined}
      >
        <Feather name={name} size={size} color={color} />
      </Touchable>
    </View>
  )
}

export default IconButton
