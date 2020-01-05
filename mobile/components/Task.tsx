import React, { useCallback } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Touchable from 'react-native-platform-touchable'
import IconButton from './IconButton'
import { TaskType, useMarkComplete, useMarkIncomplete } from '../data/tasks'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderBottomColor: '#e4e4e6',
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
  },
  task: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  content: {
    fontSize: 18,
    marginLeft: 12,
    marginVertical: 9,
    lineHeight: 24,
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#787A87'
  }
})

interface Props {
  onRequestEdit?: (id: string) => void
}

const Task: React.FC<TaskType & Props> = ({ onRequestEdit, ...task }) => {
  const { content, isCompleted } = task
  const [markCompleted] = useMarkComplete(task)
  const [markIncomplete] = useMarkIncomplete(task)

  const onPressContainer = useCallback(() => {
    onRequestEdit(task.id)
  }, [onRequestEdit])

  const onPressCheckbox = useCallback(async () => {
    if (isCompleted) {
      await markIncomplete()
    } else {
      await markCompleted()
    }
  }, [isCompleted, markCompleted, markIncomplete])

  return (
    <Touchable
      style={styles.container}
      onPress={onPressContainer}
      delayPressOut={300}
    >
      <View style={styles.task}>
        <IconButton
          size={24}
          name={isCompleted ? 'check' : 'circle'}
          color={isCompleted ? '#2e8ae6' : '#a7aaba'}
          onPress={onPressCheckbox}
          withHapticFeedback
        />
        <Text style={[styles.content, isCompleted && styles.completed]}>{content}</Text>
      </View>
    </Touchable>
  )
}

export default Task
