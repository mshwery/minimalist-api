import React, { useRef, useCallback } from 'react'
import { StyleSheet, View, TextInput, Keyboard, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native'
import { useCreateTask, TaskType, useUpdateTask } from '../data/tasks'
import BottomSheet from './BottomSheet'

const styles = StyleSheet.create({
  ModalContent: {
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  TaskInput: {
    fontSize: 16,
  }
})

interface Props {
  existingContent?: string
  isVisible: boolean
  listId: string
  task?: TaskType,
  onClose?: () => void
  onRequestClose: () => void
}

const EditTaskModal: React.FC<Props> = ({
  isVisible,
  listId,
  task,
  onClose,
  onRequestClose
}) => {
  const newTaskRef = useRef<TextInput>()
  const [updateTask, updateTaskData] = useUpdateTask(task, listId)
  const [createTask, createTaskData] = useCreateTask(listId)

  const onSubmitEditing = useCallback(async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    Keyboard.dismiss()
    onRequestClose()

    const content = e.nativeEvent.text.trim()
    if (!content) {
      return
    }

    if (task && task.id) {
      await updateTask({ variables: {
        input: {
          id: task.id,
          content
        }
      }})
    } else {
      await createTask({ variables: {
        input: {
          listId: listId === 'inbox' ? null : listId,
          content
        }
      }})
    }
  }, [updateTask, createTask, task, listId])

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
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }
      }}
      duration={150}
      isVisible={isVisible}
      onClose={onClose}
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
          defaultValue={task ? task.content : undefined}
          onSubmitEditing={onSubmitEditing}
          placeholder={task && task.id ? 'Enter task' : 'Add a task'}
          placeholderTextColor='#A6B1BB'
          ref={newTaskRef}
          returnKeyType='done'
          style={styles.TaskInput}
        />
      </View>
    </BottomSheet>
  )
}

export default EditTaskModal
