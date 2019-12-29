import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import IconButton from './IconButton'
import { TaskType, useMarkComplete, useMarkIncomplete } from '../data/tasks'

const styles = StyleSheet.create({
  Task: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderBottomColor: '#e4e4e6',
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
  },
  TaskContent: {
    fontSize: 18,
    marginLeft: 12,
    marginVertical: 10,
    lineHeight: 24,
    flex: 1,
  },
  CompletedTask: {
    textDecorationLine: 'line-through',
    color: '#787A87'
  }
})

const Task: React.FC<TaskType> = (task) => {
  const { content, isCompleted } = task
  const [markCompleted] = useMarkComplete(task)
  const [markIncomplete] = useMarkIncomplete(task)

  return (
    <View style={styles.Task}>
      <IconButton
        size={24}
        name={isCompleted ? 'check' : 'circle'}
        color={isCompleted ? '#2e8ae6' : '#a7aaba'}
        onPress={() => isCompleted ? markIncomplete() : markCompleted()}
        withHapticFeedback
      />
      <Text style={[styles.TaskContent, isCompleted && styles.CompletedTask]}>{content}</Text>
    </View>
  )
}

export default Task
