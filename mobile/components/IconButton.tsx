import React from 'react'
import { View, Vibration, TouchableNativeFeedback } from 'react-native'
import { Feather } from '@expo/vector-icons'

interface Props {
  color?: string
  name: string
  size: number
  style?: any
  withHapticFeedback?: boolean
}

const IconButton: React.FC<React.ComponentProps<typeof TouchableNativeFeedback> & Props> = ({
  color = '#242527',
  name,
  size,
  style = {},
  withHapticFeedback,
  ...props
}) => {
  return (
    <View style={[{ borderRadius: 999, overflow: 'hidden' }, style]}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple('#a3cdf7', true)}
        {...props}
        onPressIn={() => withHapticFeedback ? Vibration.vibrate(3) : undefined}
      >
        <View style={{ padding: Math.round(size * .4) }}>
          <Feather name={name} size={size} color={color} />
        </View>
      </TouchableNativeFeedback>
    </View>
  )
}

export default IconButton
