import React from 'react'
import { css } from 'emotion'
import { debounce } from 'lodash'
import { Trash2, Menu as DragIcon } from 'react-feather'
import { Checkbox, Pane, scale, ContentEditableText, Icon, colors } from '../../base-ui'
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd'

const iconStyles = css`
  display: flex;
  cursor: pointer;
  color: ${colors.fill.muted};

  &:hover {
    color: ${colors.fill.danger};
  }
`

const DeleteIcon = (props: any) => (
  <Trash2 size={scale(2.5)} {...props} className={iconStyles} />
)

interface Props extends React.ComponentProps<typeof ContentEditableText> {
  // Whether or not to automatically focus this Task on render
  autoFocus?: boolean
  canDelete?: boolean
  content?: string
  isCompleted?: boolean
  id?: string
  isDraggable?: boolean
  isDragging?: boolean
  isDraggingAnother?: boolean
  dragHandleProps?: DraggableProvidedDragHandleProps | null
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
  optimisticChecked: boolean
}

export default class Task extends React.PureComponent<Props, State> {
  inputRef = React.createRef<ContentEditableText>()

  state = {
    content: this.props.content,
    hasFocus: false,
    hasHover: false,
    optimisticChecked: this.props.isCompleted || false
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
    if (!this.state.hasHover && !this.props.isDraggingAnother) {
      this.setState({ hasHover: true })
    }
  }

  handleMouseEnter = (_event: React.MouseEvent) => {
    if (!this.props.isDraggingAnother) {
      this.setState({ hasHover: true })
    }
  }

  handleMouseLeave = (_event: React.MouseEvent) => {
    if (!this.props.isDraggingAnother) {
      this.setState({ hasHover: false })
    }
  }

  handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isOptimisticallyCompleted = event.target.checked
    this.setState({ optimisticChecked: isOptimisticallyCompleted })

    const callback = isOptimisticallyCompleted
      ? this.props.onMarkComplete
      : this.props.onMarkIncomplete

    if (typeof callback === 'function') {
      callback(event)
    }
  }

  render() {
    const {
      autoFocus,
      canDelete,
      dragHandleProps,
      isDraggable,
      isDragging,
      onKeyDown,
      onKeyUp,
      onRequestDelete
    } = this.props

    const { content, hasFocus, hasHover, optimisticChecked } = this.state
    const showActions = hasFocus || hasHover

    return (
      <Pane
        display='flex'
        alignItems='center'
        marginLeft={scale(-3)}
        marginRight={scale(-1)}
        paddingX={scale(1)}
        paddingY={scale(0.5)}
        backgroundColor={showActions || isDragging ? colors.fill.background : undefined}
        borderRadius={4}
        elevation={isDragging ? 1 : 0}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
        className={css`
          min-height: 30px;

          @media (max-width: 600px) {
            min-height: 36px;
          }
        `}
      >
        <Icon
          icon={DragIcon}
          size={scale(1.5)}
          marginRight={scale(0.5)}
          color={colors.fill.secondary}
          opacity={(showActions || isDragging) && isDraggable ? 1 : 0}
          {...dragHandleProps}
        />
        <Checkbox
          checked={optimisticChecked}
          onChange={this.handleCheckedChange}
          flex='none'
          marginRight={scale(1)}
        />
        <ContentEditableText
          ref={this.inputRef}
          autoFocus={autoFocus}
          flex='1'
          color={optimisticChecked ? colors.text.muted : 'inherit'}
          textDecoration={optimisticChecked ? 'line-through' : undefined}
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
        {showActions && canDelete && <DeleteIcon onClick={onRequestDelete} />}
      </Pane>
    )
  }
}
