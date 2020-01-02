import { useState, useEffect } from 'react'
import { Keyboard } from 'react-native'

export function useKeyboard() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [isKeyboardOpening, setKeyboardOpening] = useState(false)
  const [isKeyboardClosing, setKeyboardClosing] = useState(false)

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardOpening(true)
      setKeyboardClosing(false)
    })

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true)
      setKeyboardOpening(false)
      setKeyboardClosing(false)
    })

    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardOpening(false)
      setKeyboardClosing(true)
    })

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
      setKeyboardOpening(false)
      setKeyboardClosing(false)
    })

    return () => {
      keyboardWillShowListener.remove()
      keyboardDidHideListener.remove()
      keyboardWillHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  return {isKeyboardVisible, isKeyboardOpening, isKeyboardClosing}
}
