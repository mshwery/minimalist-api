// This is basically a copy of
// https://github.com/nysamnang/react-native-raw-bottom-sheet
// but using only translate animations instead of height

import React, {
  forwardRef, ReactNode,
  RefForwardingComponent,
  useImperativeHandle,
  useState
} from 'react'
import {
  Animated,
  Modal,
  ModalPropsIOS,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View, ViewProps, ViewStyle
} from 'react-native'

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#00000077'
  },
  mask: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  container: {
    backgroundColor: '#fff',
    width: '100%',
    overflow: 'hidden'
  }
})

const SUPPORTED_ORIENTATIONS: ModalPropsIOS['supportedOrientations'] = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right'
]

interface BottomSheetProps {
  animationType?: 'none' | 'fade' | 'slide'
  height?: number
  minClosingHeight?: number
  duration?: number
  closeOnSwipeDown?: boolean
  closeOnPressMask?: boolean
  onClose?: () => void
  children?: ReactNode
  customStyles?: {
    wrapper?: ViewStyle
    container?: ViewStyle
  }
}

export type BottomSheetRef = {
  close: () => void,
  open: () => void
}

export type BottomSheetComponent = RefForwardingComponent<
  BottomSheetRef,
  BottomSheetProps
>

const BottomSheet: BottomSheetComponent = ({
  animationType = 'none',
  children,
  closeOnPressMask = true,
  closeOnSwipeDown = false,
  customStyles = {},
  duration = 200,
  height = 260,
  onClose,
}, ref) => {
  const [modalVisible, setModalVisibility] = useState(false)
  const [currentHeight, setCurrentHeight] = useState(height)
  const [pan] = useState(new Animated.ValueXY({
    x: 0,
    y: currentHeight
  }))

  const setModalVisible = (visible: boolean) => {
    if (visible) {
      setModalVisibility(true)
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration,
      }).start()
    } else {
      Animated.timing(pan, {
        toValue: { x: 0, y: currentHeight },
        duration
      }).start(() => {
        setModalVisibility(false)
        if (typeof onClose === 'function') {
          onClose()
        }
      })
    }
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => closeOnSwipeDown,
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dy > 0) {
        Animated.event([null, { dy: pan.y }])(e, gestureState)
      }
    },
    onPanResponderRelease: (_e, gestureState) => {
      const distanceToClose = currentHeight * 0.5

      if (gestureState.dy > distanceToClose || gestureState.vy > 0.65) {
        setModalVisible(false)
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          bounciness: 0,
        }).start()
      }
    }
  })

  const handleChildrenLayout: ViewProps['onLayout'] = event => {
    setCurrentHeight(event.nativeEvent.layout.height)
  }

  const open = () => {
    setModalVisible(true)
  }

  const close = () => {
    setModalVisible(false)
  }

  useImperativeHandle(ref, () => ({
    close, open
  }))

  const animatedViewStyles = {
    transform: pan.getTranslateTransform()
  }

  return (
    <Modal
      transparent
      animationType={animationType}
      visible={modalVisible}
      supportedOrientations={SUPPORTED_ORIENTATIONS}
      onRequestClose={() => setModalVisible(false)}
    >
      <View
        style={[
          styles.wrapper,
          customStyles.wrapper
        ]}>
        <TouchableOpacity
          style={styles.mask}
          activeOpacity={1}
          onPress={() => (closeOnPressMask ? close() : {})}
        />
        <View onLayout={handleChildrenLayout}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.container,
              customStyles.container,
              animatedViewStyles
            ]}>
            {children || <View />}
          </Animated.View>
        </View>
      </View>
    </Modal>
  )
}

export default forwardRef(BottomSheet)
