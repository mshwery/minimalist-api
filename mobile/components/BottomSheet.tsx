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
  ScrollView,
  View, ViewProps, ViewStyle, Platform, KeyboardAvoidingView, Keyboard
} from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-gesture-handler'

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
  onOpen?: () => void
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
  onOpen,
}, ref) => {
  const insets = useSafeArea()
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
      onRequestClose={() => setModalVisible(false)}
    >
      <ScrollView
        contentContainerStyle={[
          styles.wrapper,
          customStyles.wrapper
        ]}
        scrollEnabled={false}
        keyboardShouldPersistTaps='handled'
      >
        <TouchableOpacity
          style={styles.mask}
          activeOpacity={1}
          onPress={() => {
            console.log(`pressed`)
            if (closeOnPressMask) {
              close()
            }
          }}
        />
        <TextInput placeholder='another' />
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

export default forwardRef(BottomSheet)
