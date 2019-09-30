import React from 'react'
import { Checkbox, Pane, scale } from '../../base-ui'
import InlineEdit from '../InlineEditableTextField'
import Box from 'ui-box'

interface Props {
  id?: string
  content?: string
  isCompleted?: boolean
  createdAt?: string
  updatedAt?: string
  completedAt?: string
  onContentChange?: (content: string) => void
  onMarkComplete?: (event: React.SyntheticEvent) => void
  onMarkIncomplete?: (event: React.SyntheticEvent) => void
}

export default class Task extends React.PureComponent<Props> {
  contentRef = React.createRef<HTMLInputElement>()

  handleContentChange = () => {
    if (!this.contentRef.current) {
      return
    }

    const content = this.contentRef.current.value
    if (content && this.props.content !== content && typeof this.props.onContentChange === 'function') {
      this.props.onContentChange(content)
    }
  }

  render() {
    return (
      <Pane display='flex'>
        <Checkbox
          checked={this.props.isCompleted}
          onChange={this.props.isCompleted ? this.props.onMarkIncomplete : this.props.onMarkComplete}
          flex='none'
          marginRight={scale(1)}
        />
        <InlineEdit
          flex='1'
          minHeight={20}
          editView={(
            <Box
              innerRef={this.contentRef as any}
              is='input'
              type='text'
              defaultValue={this.props.content}
              autoFocus
              width='100%'
              padding={0}
              border='none'
              fontSize='inherit'
              fontWeight='inherit'
              color='inherit'
              style={{ outline: 'none' }}
            />
          )}
          readView={(
            <Box minHeight={20}>
              {this.props.content}
            </Box>
          )}
          onConfirm={this.handleContentChange}
        />
      </Pane>
    )
  }
}
