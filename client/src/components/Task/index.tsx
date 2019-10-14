import React from 'react'
import { css } from 'emotion'
import { debounce } from 'lodash'
import { Trash2 } from 'react-feather'
import { Checkbox, Pane, scale, ContentEditableText } from '../../base-ui'

// TODO: move to base ui
const dormantColor = '#C9CACF'
const dangerColor = '#E44343'

const iconStyles = css`
  display: flex;
  cursor: pointer;
  color: ${dormantColor};

  &:hover {
    color: ${dangerColor};
  }
`

const DeleteIcon = (props: any) => (
  <Trash2 size={scale(2.5)} {...props} className={iconStyles} />
)

interface Props extends React.ComponentProps<typeof ContentEditableText> {
  // Whether or not to automatically focus this Task on render
  autoFocus?: boolean
  content?: string
  isCompleted?: boolean
  onContentChange?: (content: string) => void
  onDoneEditing?: (event: React.SyntheticEvent, content: string) => void
  onMarkComplete?: (event: React.SyntheticEvent) => void
  onMarkIncomplete?: (event: React.SyntheticEvent) => void
  onRequestDelete?: (event: React.SyntheticEvent) => void
}

interface State {
  content?: string
  hasFocus: boolean
  hasHover: boolean
}

export default class Task extends React.PureComponent<Props, State> {
  inputRef = React.createRef<ContentEditableText>()

  state = {
    content: this.props.content,
    hasFocus: false,
    hasHover: false
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

  handleBlur = (event: React.SyntheticEvent) => {
    const currentTarget = event.currentTarget

    requestAnimationFrame(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({ hasFocus: false })
      }
    })
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

  handleMouseMove = (_event: React.MouseEvent) => {
    if (!this.state.hasHover) {
      this.setState({ hasHover: true })
    }
  }

  handleMouseEnter = (_event: React.MouseEvent) => {
    this.setState({ hasHover: true })
  }

  handleMouseLeave = (_event: React.MouseEvent) => {
    this.setState({ hasHover: false })
  }

  render() {
    const {
      autoFocus,
      isCompleted,
      onMarkComplete,
      onMarkIncomplete,
      onKeyDown,
      onKeyUp,
      onRequestDelete
    } = this.props

    const { content, hasFocus, hasHover } = this.state
    const showActions = hasFocus || hasHover

    return (
      <Pane
        display='flex'
        minHeight={30}
        alignItems='center'
        marginX={scale(-1)}
        paddingX={scale(1)}
        paddingY={scale(0.5)}
        backgroundColor={showActions ? '#f7f9fa' : undefined}
        borderRadius={4}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
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
          content={content}
          onBlur={this.emitDoneEditing}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
        />
        {showActions && <DeleteIcon onClick={onRequestDelete} />}
      </Pane>
    )
  }
}
