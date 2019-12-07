import React from 'react'
import { css } from 'emotion'
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd'
import { Trash2, Menu as DragIcon } from 'react-feather'
import { Checkbox, Pane, scale, ContentEditableText, colors } from '../../base-ui'
import { ActionIcon } from './ActionIcon'

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

export class Task extends React.Component<Props, State> {
  inputRef = React.createRef<ContentEditableText>()

  state = {
    content: this.props.content,
    hasFocus: false,
    hasHover: false,
    optimisticChecked: this.props.isCompleted || false
  }

  emitDoneEditing = (event: React.SyntheticEvent<Element>, value: string) => {
    if (typeof this.props.onDoneEditing === 'function') {
      this.props.onDoneEditing(event, value)
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

    if (!currentTarget.contains(document.activeElement)) {
      this.setState({ hasFocus: false })
    }
  }

  handleChange = (_event: React.KeyboardEvent<Element>, value: string) => {
    this.setState({ content: value })
  }

  handleFocus = (_event: React.SyntheticEvent) => {
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
    const showDelete = showActions && canDelete

    return (
      <Pane
        display='flex'
        alignItems='flex-start'
        marginLeft={scale(-3)}
        marginRight={scale(-1)}
        paddingRight={scale(1)}
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
        <ActionIcon
          icon={DragIcon}
          size={scale(1.5)}
          paddingLeft={scale(1)}
          marginRight={scale(0.5)}
          color={colors.fill.secondary}
          opacity={(showActions || isDragging) && isDraggable ? 1 : 0}
          {...dragHandleProps}
        />
        <Checkbox
          checked={optimisticChecked}
          onChange={this.handleCheckedChange}
          marginRight={scale(1)}
          className={css`
            margin-top: 5px;
            margin-bottom: 5px;

            @media (max-width: 600px) {
              margin-top: 8px;
              margin-bottom: 8px;
            }
          `}
        />
        <ContentEditableText
          ref={this.inputRef}
          autoFocus={autoFocus}
          color={optimisticChecked ? colors.text.muted : 'inherit'}
          textDecoration={optimisticChecked ? 'line-through' : undefined}
          content={content}
          onBlur={this.emitDoneEditing}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          paddingRight={!showDelete && canDelete ? 20 : undefined}
          className={css`
            flex: 1;
            outline: none;
            padding-top: 3px;
            padding-bottom: 3px;
            line-height: 24px;

            @media (max-width: 600px) {
              line-height: 26px;
              padding-top: 5px;
              padding-bottom: 5px;
            }
          `}
        />
        {showDelete && (
          <ActionIcon
            icon={Trash2}
            onClick={onRequestDelete}
            className={css`
              color: ${colors.fill.muted};

              &:hover {
                color: ${colors.fill.danger};
              }
            `}
          />
        )}
      </Pane>
    )
  }
}
