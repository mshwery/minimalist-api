// This is basically a copy of
// https://github.com/nysamnang/react-native-raw-bottom-sheet
// but using only translate animations instead of height

import React, {
  ReactNode,
  FunctionComponent,
  useState,
  useEffect
} from 'react'
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ModalPropsIOS,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle
} from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'

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
  children?: ReactNode
  closeOnSwipeDown?: boolean
  closeOnPressMask?: boolean
  customStyles?: {
    wrapper?: ViewStyle
    container?: ViewStyle
  }
  duration?: number
  height?: number
  isVisible?: boolean
  onClose?: () => void
  onOpen?: () => void
  onRequestClose?: () => void
}

const BottomSheet: FunctionComponent<BottomSheetProps> = ({
  animationType = 'none',
  children,
  closeOnPressMask = true,
  closeOnSwipeDown = false,
  customStyles = {},
  duration = 200,
  height = 260,
  isVisible = false,
  onClose,
  onOpen,
  onRequestClose
}, ref) => {
  const [modalVisible, setModalVisibility] = useState(isVisible)
  const insets = useSafeArea()
  const [currentHeight, setCurrentHeight] = useState(height)
  const [pan] = useState(new Animated.ValueXY({
    x: 0,
    y: currentHeight
  }))

  // Transition modal when visibility prop changes
  useEffect(() => toggleModal(isVisible), [isVisible])

  const toggleModal = (visible: boolean) => {
    if (visible) {
      setModalVisibility(true)
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration,
      }).start(() => {
        if (typeof onOpen === 'function') {
          onOpen()
        }
      })
    } else {
      Keyboard.dismiss()
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
        onRequestClose()
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

  const animatedViewStyles = {
    transform: pan.getTranslateTransform()
  }

  const safeAreaStyles = {
    paddingBottom: Platform.select({ ios: insets.bottom, android: 8 })
  }

  const KeyboardAvoidingComponent = Platform.select<typeof KeyboardAvoidingView | typeof View>({ ios: KeyboardAvoidingView, android: View })

  return (
    <Modal
      transparent
      animationType={animationType}
      visible={modalVisible}
      supportedOrientations={SUPPORTED_ORIENTATIONS}
      onRequestClose={onRequestClose}
      onDismiss={() => console.log('dismissed')}
    >
      <ScrollView
        contentContainerStyle={[
          styles.wrapper,
          customStyles.wrapper
        ]}
        keyboardShouldPersistTaps={closeOnPressMask ? 'handled' : 'never'}
      >
        <TouchableOpacity
          style={styles.mask}
          activeOpacity={1}
          onPress={closeOnPressMask ? onRequestClose : undefined}
        />
        <KeyboardAvoidingComponent behavior={Platform.select({ ios: 'padding', android: undefined})}>
          <View onLayout={handleChildrenLayout}>
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.container,
                customStyles.container,
                safeAreaStyles,
                animatedViewStyles
              ]}>
              {children || <View />}
            </Animated.View>
          </View>
        </KeyboardAvoidingComponent>
      </ScrollView>
    </Modal>
  )
}

export default BottomSheet
