import React from 'react'
import { PlusCircle } from 'react-feather'
import { Button, scale, Text } from '../../base-ui'

interface Props extends React.ComponentProps<typeof Button> {
  onClick?: any
}

const AddTaskButton: React.FunctionComponent<Props> = (props) => {
  return (
    <Button {...props} paddingX={scale(1)}>
      <PlusCircle size={scale(2)} /><Text size={300} marginLeft={scale(1)}>Add task</Text>
    </Button>
  )
}

export default AddTaskButton
