import React from 'react'
import { debounce } from 'lodash'
import { Checkbox, Pane, scale, ContentEditableText } from '../../base-ui'

interface Props extends React.ComponentProps<typeof ContentEditableText> {
  // Whether or not to automatically focus this Task on render
  autoFocus?: boolean
  content?: string
  isCompleted?: boolean
  onContentChange?: (content: string) => void
  onMarkComplete?: (event: React.SyntheticEvent) => void
  onMarkIncomplete?: (event: React.SyntheticEvent) => void
}

interface State {
  content?: string
}

export default class Task extends React.PureComponent<Props, State> {
  state = {
    content: this.props.content
  }

  emitChange = (value: string) => {
    if (value && this.props.content !== value && typeof this.props.onContentChange === 'function') {
      this.props.onContentChange(value)
    }
  }

  debouncedEmitChange = debounce(this.emitChange, 300)

  handleChange = (_event: React.KeyboardEvent<Element>, value: string) => {
    this.setState({ content: value })
    this.debouncedEmitChange(value)
  }

  render() {
    const {
      autoFocus,
      isCompleted,
      onMarkComplete,
      onMarkIncomplete,
      onKeyDown,
      onKeyUp,
      onKeyPress
    } = this.props

    return (
      <Pane display='flex' minHeight={30} alignItems='center'>
        <Checkbox
          checked={isCompleted}
          onChange={isCompleted ? onMarkIncomplete : onMarkComplete}
          flex='none'
          marginRight={scale(1)}
        />
        <ContentEditableText
          autoFocus={autoFocus}
          flex='1'
          color={isCompleted ? '#787A87' : 'inherit'}
          textDecoration={isCompleted ? 'line-through' : undefined}
          style={{
            outline: 'none'
          }}
          content={this.state.content}
          onChange={this.handleChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onKeyPress={onKeyPress}
        />
      </Pane>
    )
  }
}
