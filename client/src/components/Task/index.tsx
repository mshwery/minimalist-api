import React from 'react'
import { debounce } from 'lodash'
import { Checkbox, Pane, scale, ContentEditableText } from '../../base-ui'

interface Props extends React.ComponentProps<typeof ContentEditableText> {
  // Whether or not to automatically focus this Task on render
  autoFocus?: boolean
  content?: string
  isCompleted?: boolean
  onContentChange?: (content: string) => void
  onDoneEditing?: (event: React.SyntheticEvent, content: string) => void
  onMarkComplete?: (event: React.SyntheticEvent) => void
  onMarkIncomplete?: (event: React.SyntheticEvent) => void
}

interface State {
  content?: string
}

export default class Task extends React.PureComponent<Props, State> {
  inputRef = React.createRef<ContentEditableText>()

  state = {
    content: this.props.content
  }

  emitChange = (value: string) => {
    if (value && this.props.content !== value && typeof this.props.onContentChange === 'function') {
      this.props.onContentChange(value)
    }
  }

  debouncedEmitChange = debounce(this.emitChange, 300)

  emitDoneEditing= (event: React.SyntheticEvent<Element>, value: string) => {
    if (typeof this.props.onDoneEditing === 'function') {
      this.props.onDoneEditing(event, value)
    }
  }

  focusInput = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focusInput()
    }
  }

  resetInput = (content: string) => {
    this.setState({ content })
    if (this.inputRef.current) {
      this.inputRef.current.resetInput(content)
    }
  }

  handleChange = (_event: React.KeyboardEvent<Element>, value: string) => {
    this.setState({ content: value })
    this.debouncedEmitChange(value)
  }

  handleKeyPress = (event: React.KeyboardEvent<Element>, value: string) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.emitDoneEditing(event, value)
    }

    if (typeof this.props.onKeyPress === 'function') {
      this.props.onKeyPress(event, value)
    }
  }

  render() {
    const {
      autoFocus,
      isCompleted,
      onMarkComplete,
      onMarkIncomplete,
      onKeyDown,
      onKeyUp
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
          ref={this.inputRef}
          autoFocus={autoFocus}
          flex='1'
          color={isCompleted ? '#787A87' : 'inherit'}
          textDecoration={isCompleted ? 'line-through' : undefined}
          style={{
            outline: 'none'
          }}
          content={this.state.content}
          onBlur={this.emitDoneEditing}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
        />
      </Pane>
    )
  }
}
