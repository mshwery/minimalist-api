import React, { useCallback } from 'react'
import { TaskType, useMarkComplete, useMarkIncomplete } from '../../data/tasks'
import { Task } from './Task'

interface Props extends TaskType {
  onRequestEdit?: (id: string) => void
}

const TaskContainer: React.FC<Props> = ({ onRequestEdit, ...task }) => {
  const [markCompleted] = useMarkComplete(task)
  const [markIncomplete] = useMarkIncomplete(task)

  const onPressContainer = useCallback(() => {
    onRequestEdit(task.id)
  }, [task.id, onRequestEdit])

  const onPressCheckbox = useCallback(async () => {
    if (task.isCompleted) {
      await markIncomplete()
    } else {
      await markCompleted()
    }
  }, [task.id, task.isCompleted, markCompleted, markIncomplete])

  return (
    <Task
      content={task.content}
      isComplete={task.isCompleted}
      onPressContainer={onPressContainer}
      onPressCheckbox={onPressCheckbox}
    />
  )
}

export default TaskContainer
