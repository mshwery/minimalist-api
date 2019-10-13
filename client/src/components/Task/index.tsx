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
  hasFocus: boolean
}

export default class Task extends React.PureComponent<Props, State> {
  inputRef = React.createRef<ContentEditableText>()

  state = {
    content: this.props.content,
    hasFocus: false
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

  handleBlur = (event: React.SyntheticEvent, value: string) => {
    this.setState({ hasFocus: false })
    this.emitDoneEditing(event, value)
  }

  handleChange = (_event: React.KeyboardEvent<Element>, value: string) => {
    this.setState({ content: value })
    this.debouncedEmitChange(value)
  }

  handleFocus = (event: React.SyntheticEvent) => {
    this.setState({ hasFocus: true })
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
      <Pane
        display='flex'
        minHeight={30}
        alignItems='center'
        paddingX={scale(1)}
        paddingY={scale(0.5)}
        backgroundColor={this.state.hasFocus ? '#f7f9fa' : undefined}
        borderRadius={4}
      >
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
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onFocus={this.handleFocus}
        />
      </Pane>
    )
  }
}
