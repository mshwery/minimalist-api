import { css } from '@emotion/css'
import React, { PureComponent } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd'
import { Sidebar as SidebarIcon, ChevronDown, ChevronUp } from 'react-feather'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Maybe } from '../../@types/type-helpers'
import { move } from '../../lib/array-move'
import { Heading, Text, Pane, scale, Input, colors, Icon, Spinner, withToasts, WithToastProps } from '../../base-ui'
import {
  List,
  Task as TaskType,
  getList,
  renameList,
  createTask,
  reopenTask,
  completeTask,
  updateTask,
  getTasks,
  deleteTask,
  moveTask,
  archiveList,
  deleteList,
  AuthError,
} from './queries'
import Task from '../Task'
import InlineEdit from '../InlineEditableTextField'
import { CreateNewTask } from './CreateNewTask'
import { ListMenu } from './ListMenu'
import { ShareMenu } from './ShareMenu'
import { withUserContext } from '../UserContext'
import type { UserContext } from '../UserContext'

const Container: React.FunctionComponent<any> = (props) => (
  <Pane
    {...props}
    flex="none"
    width="100%"
    maxWidth={scale(100)}
    minWidth={scale(40)}
    minHeight="100vh"
    className={css`
      padding: ${scale(4)}px ${scale(6)}px;

      @media (max-width: 1224px) {
        padding: ${scale(3)}px;
        padding-left: ${scale(4)}px;
      }
    `}
  />
)

interface Props {
  listId: string
  canEditList?: boolean
  requestSideBar?: () => void
  requestSideBarClose?: () => void
}

interface State {
  autoFocusId: Maybe<string>
  list: Maybe<List>
  tasks: TaskType[]
  name: string
  isLoading: boolean
  showCompletedTasks: boolean
}

// TODO: break this up into the list detail view and the task editor
class ListWithData extends PureComponent<Props & UserContext & WithToastProps & RouteComponentProps<{}, {}>, State> {
  nameRef = React.createRef<HTMLInputElement>()

  state: State = {
    autoFocusId: null,
    list: null,
    tasks: [],
    name: '',
    isLoading: true,
    showCompletedTasks: false,
  }

  async componentDidMount() {
    // TODO: cancel on componentWillUnmount
    await this.fetchList()
  }

  async componentDidUpdate(prevProps: Props) {
    if (this.props.listId !== prevProps.listId) {
      // TODO: cancel on componentWillUnmount
      await this.fetchList()
    }
  }

  fetchList = async () => {
    this.setState({ isLoading: true })

    try {
      if (this.props.listId === 'inbox') {
        this.setState({ name: 'Inbox' })
      } else {
        const { list } = await getList(this.props.listId)

        if (list) {
          this.setState({ list, name: list.name })
        } else {
          this.props.history.push('/lists')
          return
        }
      }

      const { tasks } = await getTasks(this.props.listId)
      this.setState({ tasks })
    } catch (error) {
      // TODO add frontend Segment + error tracking
      if (error instanceof AuthError) {
        this.props.unsetUser()
      }
    } finally {
      this.setState({ isLoading: false })
    }
  }

  handleNameChange = () => {
    if (!this.nameRef.current) {
      return
    }

    const name = this.nameRef.current.value

    if (name && this.state.name !== name) {
      this.setState({ name })
      void this.renameList(name)
    }
  }

  createNewTask = async (content: string, position?: number) => {
    const id = uuidv4()
    const listId = this.props.listId === 'inbox' ? undefined : this.props.listId

    const optimisticTask: TaskType = {
      id,
      listId,
      content,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sortOrder: position !== undefined ? position : this.state.tasks.length + 1,
    }

    const optimisticTasks: TaskType[] = Array.from(this.state.tasks)
    if (position !== undefined) {
      optimisticTasks.splice(position, 0, optimisticTask)
    } else {
      optimisticTasks.push(optimisticTask)
    }

    this.setState({
      autoFocusId: position !== undefined ? optimisticTask.id : null,
      tasks: optimisticTasks,
    })

    try {
      await createTask({ id, content, position, listId })
    } catch (error) {
      if (error instanceof AuthError) {
        this.props.unsetUser()
      }
      this.props.addToast({ text: `Couldn't create task: ${error.message}` })
    }
  }

  updateTaskContent = async (id: string, content: string) => {
    const input = { id, content }

    try {
      const task = await updateTask(input)
      this.updateTaskInState(task)
    } catch (error) {
      if (error instanceof AuthError) {
        this.props.unsetUser()
      }
      this.props.addToast({ text: `Couldn't update task: ${error.message}` })
    }
  }

  handleMarkComplete = async (id: string) => {
    try {
      // Optimistic update
      this.updateTaskInState({ id, isCompleted: true, completedAt: new Date().toISOString() })
      const task = await completeTask({ id })
      this.updateTaskInState(task)
    } catch (error) {
      if (error instanceof AuthError) {
        this.props.unsetUser()
      }
      this.props.addToast({ text: `Couldn't update task: ${error.message}` })
      this.updateTaskInState({ id, isCompleted: false, completedAt: undefined })
    }
  }

  handleMarkIncomplete = async (id: string) => {
    const original = this.state.tasks.find((t) => t.id === id)
    try {
      // Optimistic update
      this.updateTaskInState({ id, isCompleted: false, completedAt: undefined })
      const task = await reopenTask({ id })
      this.updateTaskInState(task)
    } catch (error) {
      if (error instanceof AuthError) {
        this.props.unsetUser()
      }
      this.props.addToast({ text: `Couldn't update task: ${error.message}` })
      this.updateTaskInState({ id, isCompleted: true, completedAt: original?.completedAt })
    }
  }

  updateTaskInState = (task: Maybe<Partial<TaskType>>) => {
    if (task && this.state.tasks) {
      // Update task in set
      this.setState((prevState) => ({
        tasks: prevState.tasks.map((t) => {
          if (t.id === task.id) {
            return Object.assign({}, t, task)
          }

          return t
        }),
      }))
    }
  }

  renameList = async (name: string) => {
    // Optimistic updates
    this.setState({ name })

    try {
      await renameList(this.props.listId, name)
    } catch (error) {
      if (error instanceof AuthError) {
        this.props.unsetUser()
      }
      this.props.addToast({ text: `Couldn't rename list: ${error.message}` })
    }
  }

  deleteTask = async (id: string) => {
    const tasks = this.state.tasks

    // Optimistic update
    this.setState((prevState) => ({
      tasks: prevState.tasks.filter((t) => t.id !== id),
    }))

    try {
      await deleteTask({ id })
    } catch (error) {
      if (error instanceof AuthError) {
        this.props.unsetUser()
      }
      this.props.addToast({ text: `Couldn't delete task: ${error.message}` })
      this.setState({ tasks })
    }
  }

  handleDragEnd = async (result: DropResult, _provided: ResponderProvided) => {
    const task = this.state.tasks.find((t) => t.id === result.draggableId)
    if (task && result.destination) {
      // find the sortOrder in the full list (for now, since completed tasks are excluded in this `destination.index`)
      const taskAtIndex = this.state.tasks.filter((t) => !t.isCompleted)[result.destination.index]
      const trueDestinationIndex = this.state.tasks.indexOf(taskAtIndex)
      const trueSourceIndex = this.state.tasks.indexOf(task)
      const sortOrder = trueDestinationIndex + 1

      // Reorder the tasks and update their `sortOrder`
      const resortedTasks = move(this.state.tasks, trueSourceIndex, trueDestinationIndex).map((t, i) => ({
        ...t,
        sortOrder: i + 1,
      }))

      // Synchronously update the state before persisting async
      this.setState({ tasks: resortedTasks })

      const moveTaskInput = {
        id: task.id,
        listId: this.props.listId,
        insertBefore: sortOrder,
      }

      // Update async
      try {
        await moveTask(moveTaskInput)
      } catch (error) {
        if (error instanceof AuthError) {
          this.props.unsetUser()
        }
        this.props.addToast({ text: `Couldn't move tasks: ${error.message}` })
      }
    }
  }

  handleKeyPress = (event: React.KeyboardEvent<Element>, _value: string, _id: string, index: number) => {
    // TODO: potentially split the text at the cursor (i.e. simulate plaintext editing)
    if (event.key === 'Enter') {
      void this.createNewTask('', index + 1)
    }
  }

  handleKeyDown = (event: React.KeyboardEvent<Element>, value: string, id: string, index: number) => {
    const isCompleted = this.state.tasks.find((task) => task.id === id)?.isCompleted ?? false

    // Use onKeyDown because we want to check that the value is already empty
    if (event.key === 'Backspace' && value === '') {
      void this.deleteTask(id)
      this.focusPreviousTask(index, isCompleted)
    }

    if (event.key === 'ArrowDown') {
      this.focusNextTask(index, isCompleted)
    }

    if (event.key === 'ArrowUp') {
      this.focusPreviousTask(index, isCompleted)
    }
  }

  focusNextTask = (currentIndex: number, isCompleted: boolean) => {
    const tasks = this.state.tasks.filter((task) => task.isCompleted === isCompleted)
    const nextTask = tasks[currentIndex + 1]
    const autoFocusId = nextTask ? nextTask.id : null
    this.setState({ autoFocusId })
  }

  focusPreviousTask = (currentIndex: number, isCompleted: boolean) => {
    const tasks = this.state.tasks.filter((task) => task.isCompleted === isCompleted)
    const nextTask = tasks[currentIndex - 1]
    const autoFocusId = nextTask ? nextTask.id : null
    this.setState({ autoFocusId })
  }

  toggleDisplayCompleted = () => {
    this.setState((prevState) => ({
      showCompletedTasks: !prevState.showCompletedTasks,
    }))
  }

  render() {
    const { isLoading, tasks, name, autoFocusId, showCompletedTasks } = this.state

    if (isLoading) {
      return (
        <Container>
          <Spinner showDelay={250} />
        </Container>
      )
    }

    const placeholder = 'Untitled'
    const completedTasks = tasks.filter((t) => t.isCompleted)
    const remainingTasks = tasks.filter((t) => !t.isCompleted)

    return (
      <Container onClick={this.props.requestSideBarClose}>
        <Heading display="flex" paddingBottom={scale(2)} alignItems="center">
          <Pane
            display="inline-flex"
            marginRight={scale(1)}
            flex="none"
            className={css`
              @media (min-width: 1224px) {
                display: none;
              }
            `}
          >
            <SidebarIcon
              color={colors.fill.muted}
              size={scale(2.5)}
              onClick={(e) => {
                e.stopPropagation()
                if (typeof this.props.requestSideBar === 'function') {
                  this.props.requestSideBar()
                }
              }}
            />
          </Pane>
          {this.props.canEditList ? (
            <InlineEdit
              flex="1 0 auto"
              overflow="hidden"
              editView={
                <Input
                  ref={this.nameRef}
                  defaultValue={name}
                  placeholder={placeholder}
                  autoFocus
                  flex="1 1 auto"
                  padding={0}
                  border="none"
                  fontSize="inherit"
                  fontWeight="inherit"
                  fontFamily="inherit"
                  lineHeight="inherit"
                  color="inherit"
                  outline="none"
                />
              }
              readView={<Pane>{name || placeholder}</Pane>}
              onConfirm={this.handleNameChange}
            />
          ) : (
            name
          )}
          {this.props.canEditList && (
            <>
              <ShareMenu listId={this.props.listId} creator={(this.state.list || {}).createdBy} />
              <ListMenu
                onArchiveList={async () => {
                  this.props.history.push('/lists/inbox')
                  await archiveList(this.props.listId)
                  this.props.addToast({ text: `Archived "${this.state.name}"` })
                }}
                onDeleteList={async () => {
                  this.props.history.push('/lists/inbox')
                  await deleteList(this.props.listId)
                  this.props.addToast({ text: `Deleted "${this.state.name}"` })
                }}
              />
            </>
          )}
        </Heading>

        <DragDropContext onDragEnd={this.handleDragEnd}>
          <Droppable droppableId={this.props.listId}>
            {(dropProvided, dropSnapshot) => (
              <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                {remainingTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(dragProvided, dragSnapshot) => (
                      <div ref={dragProvided.innerRef} {...dragProvided.draggableProps}>
                        <Task
                          {...task}
                          key={task.id}
                          autoFocus={autoFocusId === task.id}
                          canDelete={Boolean(task.id && !dropSnapshot.isDraggingOver)}
                          dragHandleProps={dragProvided.dragHandleProps}
                          isDraggable
                          isDragging={dragSnapshot.isDragging}
                          isDraggingAnother={dropSnapshot.isDraggingOver}
                          onMarkComplete={() => this.handleMarkComplete(task.id)}
                          onMarkIncomplete={() => this.handleMarkIncomplete(task.id)}
                          onKeyPress={(event, value) => this.handleKeyPress(event, value, task.id, index)}
                          onKeyDown={(event, value) => this.handleKeyDown(event, value, task.id, index)}
                          onRequestDelete={() => this.deleteTask(task.id)}
                          onDoneEditing={(_event, content) => {
                            // Only update if there's an actual change.
                            if (content !== task.content) {
                              void this.updateTaskContent(task.id, content)
                            }
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <CreateNewTask onDoneEditing={this.createNewTask} />

        {completedTasks.length > 0 && (
          <Pane marginTop={scale(4)} borderTop={`1px solid ${colors.fill.muted}`}>
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              onClick={this.toggleDisplayCompleted}
              paddingY={scale(2)}
              cursor="pointer"
            >
              <Text color={colors.text.muted}>Completed ({completedTasks.length})</Text>
              <Icon icon={showCompletedTasks ? ChevronUp : ChevronDown} color={colors.fill.secondary} size={scale(2)} />
            </Pane>
            {showCompletedTasks &&
              completedTasks.map((task, index) => (
                <Task
                  {...task}
                  key={task.id}
                  autoFocus={autoFocusId === task.id}
                  canDelete={Boolean(task.id)}
                  onMarkIncomplete={() => this.handleMarkIncomplete(task.id)}
                  onKeyDown={(event, value) => this.handleKeyDown(event, value, task.id, index)}
                  onRequestDelete={() => this.deleteTask(task.id)}
                  onDoneEditing={(_event, content) => {
                    // Only update if there's an actual change.
                    if (content !== task.content) {
                      void this.updateTaskContent(task.id, content)
                    }
                  }}
                />
              ))}
          </Pane>
        )}
      </Container>
    )
  }
}

export default withRouter(withToasts(withUserContext(ListWithData)))
