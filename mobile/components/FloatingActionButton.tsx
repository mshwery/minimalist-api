import React, { useState, useEffect } from 'react'
import { Animated, StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from 'react-native'
import { Feather } from '@expo/vector-icons'

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    elevation: 2,
    bottom: 40,
    width: 56,
    height: 56,
    backgroundColor: '#2e8ae6',
    borderRadius: 56 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

interface Props extends TouchableWithoutFeedbackProps {
  initiallyVisible?: boolean
  isVisible: boolean
  position?: 'center' | 'right'
  size?: number
  style?: object
}

const FloatingActionButton: React.FC<Props> = ({
  initiallyVisible = false,
  isVisible = true,
  position = 'center',
  size = 28,
  style,
  ...props
}) => {
  const [pan] = useState(new Animated.ValueXY({
    x: 0,
    y: initiallyVisible ? 0 : 100
  }))

  useEffect(() => {
    if (isVisible) {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        bounciness: 0,
      }).start()
    } else {
      Animated.spring(pan, {
        toValue: { x: 0, y: 100 },
        bounciness: 0,
      }).start()
    }
  }, [isVisible])

  const animatedButtonStyles = {
    transform: pan.getTranslateTransform()
  }

  const positionStyles = position === 'center'
    ? { alignSelf: 'center' }
    : { right: 24 }

  return (
    <TouchableWithoutFeedback {...props}>
      <Animated.View style={[styles.button, style, animatedButtonStyles, positionStyles]}>
        <Feather name='plus' size={size} color='#ffffff' />
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default FloatingActionButton
