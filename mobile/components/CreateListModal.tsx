import React, { useCallback, useRef } from 'react'
import { StyleSheet, View, TextInput, Text } from 'react-native'
import BottomSheet from './BottomSheet'
import Button from './Button'

const styles = StyleSheet.create({
  ModalContent: {
    padding: 24
  },
  Button: {
    marginVertical: 24,
    height: 48,
  },
  Label: {
    fontSize: 18
  },
  NameInput: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: '#e4e4e6',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8
  }
})

interface Props {
  isVisible: boolean
  onRequestClose: () => void
}

const CreateListModal: React.FC<Props> = ({
  isVisible,
  onRequestClose
}) => {
  const inputRef = useRef<TextInput>()

  // Hack because `autoFocus` in a `Modal` doesn't always work...
  const onModalOpen = useCallback(() => {
    if (inputRef.current && isVisible) {
      inputRef.current.focus()
    }
  }, [inputRef.current, isVisible])

  return (
    <BottomSheet
      animationType='fade'
      closeOnSwipeDown
      customStyles={{
        container: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          height: 260
        }
      }}
      isVisible={isVisible}
      onOpen={onModalOpen}
      onRequestClose={onRequestClose}
    >
      <View style={styles.ModalContent}>
        <Text style={styles.Label}>Create a list</Text>
        <TextInput
          autoCapitalize='sentences'
          autoCorrect
          blurOnSubmit
          // onSubmitEditing={onSubmitEditing}
          placeholder={'Name your list'}
          placeholderTextColor='#A6B1BB'
          ref={inputRef}
          returnKeyType='go'
          style={styles.NameInput}
        />
        <Button
          iconBefore='plus'
          text='Create List'
          style={styles.Button}
        />
        <Button
          text='Cancel'
          style={{ backgroundColor: 'transparent', color: 'gray' }}
          onPress={onRequestClose}
        />
      </View>
    </BottomSheet>
  )
}

export default CreateListModal
