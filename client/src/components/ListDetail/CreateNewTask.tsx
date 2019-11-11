import React, { useState, useRef } from 'react'
import { css } from 'emotion'
import { Plus } from 'react-feather'
import { TextButton, scale, Icon } from '../../base-ui'
import Task from '../Task'

interface Props {
  onDoneEditing: (content: string) => any
}

const CreateNewTask: React.FunctionComponent<Props> = ({ onDoneEditing }) => {
  const [isEditing, toggleEditMode] = useState(false)
  const inputRef = useRef<Task>(null)

  if (isEditing) {
    return (
      <Task
        ref={inputRef}
        autoFocus
        onDoneEditing={(event, content) => {
          if (content) {
            onDoneEditing(content)
          }

          if (!content || event.type === 'blur') {
            toggleEditMode(false)
          }

          if (inputRef.current) {
            inputRef.current.resetInput('')
          }
        }}
      />
    )
  }

  return (
    <TextButton
      color='muted'
      width='100%'
      justifyContent='flex-start'
      onClick={() => toggleEditMode(true)}
      className={css`
        min-height: 30px;

        @media (max-width: 600px) {
          min-height: 36px;
        }
      `}
    >
      <Icon icon={Plus} size={scale(2)} width={scale(2.5)} marginRight={scale(1)} />
      Add task
    </TextButton>
  )
}

export default CreateNewTask
