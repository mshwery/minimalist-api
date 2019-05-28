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
  contentRef: null | HTMLInputElement = null

  handleContentChange = () => {
    if (!this.contentRef) {
      return
    }

    const content = this.contentRef.value
    if (content && this.props.content !== content && typeof this.props.onContentChange === 'function') {
      this.props.onContentChange(content)
    }
  }

  setContentRef = (node: null | HTMLInputElement) => {
    this.contentRef = node
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
              innerRef={this.setContentRef}
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
              appearance='none'
              outline='none'
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
