import React, { useState } from 'react'
import { Plus } from 'react-feather'
import { TextButton, scale, Pane } from '../../base-ui'
import Task from '../Task'

interface Props {
  onReadyToCreate?: (content: string) => any
}

const CreateNewTask: React.FunctionComponent<Props> = ({ onReadyToCreate }) => {
  const [isEditing, toggleEditMode] = useState(false)

  if (isEditing) {
    return <Task autoFocus onContentChange={onReadyToCreate} />
  }

  return (
    <TextButton color='muted' onClick={() => toggleEditMode(true)} minHeight={30}>
      <Pane display='flex' alignItems='center' justifyContent='center' width={scale(2.5)} marginRight={scale(1)}>
        <Plus size={scale(2)} />
      </Pane>
      Add task
    </TextButton>
  )
}

export default CreateNewTask
