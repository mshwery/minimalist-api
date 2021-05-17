import React from 'react'
import { css } from '@emotion/css'
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd'
import { Trash2, AlertCircle, Menu as DragIcon } from 'react-feather'
import { Checkbox, Pane, Stack, scale, ContentEditableText, colors } from '../../base-ui'
import ScheduleMenu from '../ScheduleMenu'
import { ActionIcon } from './ActionIcon'

interface Props extends React.ComponentProps<typeof ContentEditableText> {
  // Whether or not to automatically focus this Task on render
  autoFocus?: boolean
  canDelete?: boolean
  content?: string
  isCompleted?: boolean
  id?: string
  due?: string | null
  isDraggable?: boolean
  isDragging?: boolean
  isDraggingAnother?: boolean
  dragHandleProps?: DraggableProvidedDragHandleProps | null
  onDoneEditing?: (event: React.SyntheticEvent, content: string) => void
  onMarkComplete?: (event: React.SyntheticEvent) => void
  onMarkIncomplete?: (event: React.SyntheticEvent) => void
  onSchedule?: (due: null | Date) => void
  onRequestDelete?: () => void
}

interface State {
  content?: string
  hasFocus: boolean
  hasHover: boolean
  confirmDelete: boolean
  optimisticChecked: boolean
}

export class Task extends React.Component<Props, State> {
  inputRef = React.createRef<ContentEditableText>()

  state = {
    content: this.props.content,
    hasFocus: false,
    hasHover: false,
    confirmDelete: false,
    optimisticChecked: this.props.isCompleted || false,
  }

  emitDoneEditing = (event: React.SyntheticEvent<Element>, value: string): void => {
    if (typeof this.props.onDoneEditing === 'function') {
      this.props.onDoneEditing(event, value)
    }
  }

  resetInput = (content: string): void => {
    this.setState({ content })
    if (this.inputRef.current) {
      this.inputRef.current.resetInput(content)
    }
  }

  handleBlur = (event: React.SyntheticEvent): void => {
    const currentTarget = event.currentTarget

    if (!currentTarget.contains(document.activeElement)) {
      this.setState({ hasFocus: false, confirmDelete: false })
    }
  }

  handleChange = (_event: React.KeyboardEvent<Element>, value: string): void => {
    this.setState({ content: value })
  }

  handleFocus = (_event: React.SyntheticEvent): void => {
    this.setState({ hasFocus: true, confirmDelete: false })
  }

  handleKeyPress = (event: React.KeyboardEvent<Element>, value: string): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.emitDoneEditing(event, value)
    }

    if (typeof this.props.onKeyPress === 'function') {
      this.props.onKeyPress(event, value)
    }
  }

  handleMouseMove = (_event: React.MouseEvent): void => {
    if (!this.state.hasHover && !this.props.isDraggingAnother) {
      this.setState({ hasHover: true })
    }
  }

  handleMouseEnter = (_event: React.MouseEvent): void => {
    if (!this.props.isDraggingAnother) {
      this.setState({ hasHover: true })
    }
  }

  handleMouseLeave = (_event: React.MouseEvent): void => {
    if (!this.props.isDraggingAnother) {
      this.setState({ hasHover: false })
    }
  }

  handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isOptimisticallyCompleted = event.target.checked
    this.setState({ optimisticChecked: isOptimisticallyCompleted })

    const callback = isOptimisticallyCompleted ? this.props.onMarkComplete : this.props.onMarkIncomplete

    if (typeof callback === 'function') {
      callback(event)
    }
  }

  handleDeleteRequest = (_event: React.SyntheticEvent): void => {
    if (this.state.confirmDelete && typeof this.props.onRequestDelete === 'function') {
      this.setState({ confirmDelete: false })
      this.props.onRequestDelete()
      return
    }

    this.setState((prevState) => ({ confirmDelete: !prevState.confirmDelete }))
  }

  render(): JSX.Element {
    const { autoFocus, canDelete, due, dragHandleProps, isDraggable, isDragging, onKeyDown, onKeyUp, onSchedule } =
      this.props

    const { content, hasFocus, hasHover, optimisticChecked } = this.state
    const showActions = hasFocus || hasHover
    const showDelete = showActions && canDelete

    return (
      <Pane
        display="flex"
        alignItems="flex-start"
        marginLeft={scale(-3)}
        marginRight={scale(-1)}
        marginBottom={1}
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
          min-height: 32px;

          @media (max-width: 600px) {
            min-height: 40px;
          }
        `}
      >
        <ActionIcon
          icon={DragIcon}
          size={scale(1.5)}
          marginLeft={scale(1)}
          marginRight={scale(0.5)}
          color={colors.fill.secondary}
          opacity={(showActions || isDragging) && isDraggable ? 1 : 0}
          pointerEvents={!isDraggable ? 'none' : undefined}
          className={css`
            margin-top: 10px;

            @media (max-width: 600px) {
              margin-top: 13px;
            }
          `}
          {...dragHandleProps}
        />
        <Checkbox
          checked={optimisticChecked}
          onChange={this.handleCheckedChange}
          marginRight={scale(1)}
          className={css`
            margin-top: 6px;
            margin-bottom: 6px;

            @media (max-width: 600px) {
              margin-top: 10px;
              margin-bottom: 10px;
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
            padding-top: 4px;
            padding-bottom: 4px;
            line-height: 24px;

            @media (max-width: 600px) {
              line-height: 28px;
              padding-top: 6px;
              padding-bottom: 6px;
            }
          `}
        />
        <Stack
          direction="row"
          className={css`
            margin-top: 5px;

            @media (max-width: 600px) {
              margin-top: 9px;
            }
          `}
        >
          {(due || showActions) && onSchedule && <ScheduleMenu onSchedule={onSchedule} due={due} />}
          {showDelete && (
            <ActionIcon
              icon={this.state.confirmDelete ? AlertCircle : Trash2}
              onClick={this.handleDeleteRequest}
              color={this.state.confirmDelete ? colors.fill.danger : colors.fill.muted}
              interactiveColor={this.state.confirmDelete ? colors.fill.danger : undefined}
            />
          )}
        </Stack>
      </Pane>
    )
  }
}
