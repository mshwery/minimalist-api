import React, { useRef, useCallback } from 'react'
import { Alert, StyleSheet, View, TextInput, Keyboard, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native'
import { useCreateTask, TaskType, useUpdateTask, useDeleteTask } from '../data/tasks'
import BottomSheet from './BottomSheet'
import IconButton from './IconButton'

const styles = StyleSheet.create({
  ModalContent: {
    paddingTop: 12,
    paddingBottom: 6,
    paddingLeft: 24,
    paddingRight: 12
  },
  TaskInput: {
    fontSize: 16,
  },
  ActionTray: {
    justifyContent: 'space-between',
    minHeight: 24
  },
  DeleteButton: {
    marginLeft: 'auto'
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
  const [deleteTask] = useDeleteTask(listId)

  const onDeleteTask = useCallback(async () => {
    onRequestClose()
    await deleteTask({ variables: {
      input: {
        id: task.id
      }
    }})
  }, [deleteTask, task, listId])

  const onRequestDelete = useCallback(() => {
    Alert.alert(
      'Are you sure?',
      `"${task.content.length > 10 ? task.content.slice(0, 8) + '...' : task.content}" will be permanently deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDeleteTask }
      ]
    )
  }, [deleteTask, task, listId])

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
        <View style={styles.ActionTray}>
          {task && task.id && (
            <IconButton
              size={20}
              name='trash-2'
              color='#E44343'
              onPress={onRequestDelete}
              style={styles.DeleteButton}
              withHapticFeedback
            />
          )}
        </View>
      </View>
    </BottomSheet>
  )
}

export default EditTaskModal
