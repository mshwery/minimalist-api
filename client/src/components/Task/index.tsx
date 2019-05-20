import React from 'react'
import { Checkbox, Pane, Text, scale } from '../../base-ui'

interface Props {
  id?: string
  content?: string
  isCompleted?: boolean
  createdAt?: string
  updatedAt?: string
  completedAt?: string
}

export default class Task extends React.PureComponent<Props> {
  render() {
    return (
      <Pane>
        <Checkbox checked={this.props.isCompleted} marginRight={scale(1)} />
        <Text
          is='input'
          type='text'
          value={this.props.content}
          appearance='none'
          border='none'
          outline='none'
        />
      </Pane>
    )
  }
}
