import React, { useRef, useCallback } from 'react'
import { StyleSheet, View, TextInput, Keyboard, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native'
import { useCreateTask } from '../data/tasks'
import BottomSheet from './BottomSheet'

const styles = StyleSheet.create({
  ModalContent: {
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  TaskInput: {
    fontSize: 18,
  }
})

interface Props {
  isVisible: boolean
  listId: string
  onRequestClose: () => void
}

const CreateTaskModal: React.FC<Props> = ({
  isVisible,
  listId,
  onRequestClose
}) => {
  const newTaskRef = useRef<TextInput>()
  const [createTask, createTaskData] = useCreateTask(listId)

  const onSubmitEditing = useCallback(async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    Keyboard.dismiss()
    onRequestClose()

    const content = e.nativeEvent.text.trim()
    if (content) {
      await createTask({ variables: {
        input: {
          listId: listId === 'inbox' ? null : listId,
          content
        }
      }})
    }
  }, [])

  // Hack because `autoFocus` in a `Modal` doesn't always work...
  const onCreateTaskOpen = useCallback(() => {
    if (newTaskRef.current) {
      newTaskRef.current.focus()
    }
  }, [])

  return (
    <BottomSheet
      animationType='fade'
      closeOnSwipeDown
      customStyles={{
        container: {
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }
      }}
      duration={150}
      isVisible={isVisible}
      onOpen={onCreateTaskOpen}
      onRequestClose={onRequestClose}
    >
      <View style={styles.ModalContent}>
        <TextInput
          autoCapitalize='sentences'
          autoCorrect
          blurOnSubmit
          enablesReturnKeyAutomatically
          multiline
          onSubmitEditing={onSubmitEditing}
          placeholder='Add a task'
          placeholderTextColor='#A6B1BB'
          ref={newTaskRef}
          returnKeyType='done'
          style={styles.TaskInput}
        />
      </View>
    </BottomSheet>
  )
}

export default CreateTaskModal
