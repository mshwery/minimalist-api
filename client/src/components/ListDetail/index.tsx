import React, { PureComponent } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Sidebar as SidebarIcon } from 'react-feather'
import { css } from 'emotion'
import { Maybe } from '../../@types/type-helpers'
import { Heading, Pane, scale, Input, colors } from '../../base-ui'
import { List, Task as TaskType, getList, renameList, createTask, reopenTask, completeTask, updateTask, getTasks, deleteTask } from './queries'
import Task from '../Task'
import InlineEdit from '../InlineEditableTextField'
import CreateNewTask from './CreateNewTask'

const Container: React.FunctionComponent<any> = (props) => (
  <Pane
    {...props}
    flex='none'
    width={scale(75)}
    maxWidth='100%'
    className={css`
      padding: ${scale(10)}px ${scale(5)}px;

      @media (max-width: 1224px) {
        padding: ${scale(3)}px;
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
  autoFocusId: Maybe<string>,
  list: Maybe<List>
  tasks: TaskType[],
  name: string
  error: Maybe<Error>
  isLoading: boolean
}

// TODO: break this up into the list detail view and the task editor
class ListWithData extends PureComponent<Props & RouteComponentProps<{}, {}>, State> {
  nameRef = React.createRef<HTMLInputElement>()

  state: State = {
    autoFocusId: null,
    list: null,
    tasks: [],
    name: '',
    error: null,
    isLoading: true
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
        }
      }

      const { tasks } = await getTasks(this.props.listId)
      this.setState({ tasks })
    } catch (error) {
      // TODO add frontend Segment + error tracking
      this.setState({ error })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  // handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  handleNameChange = () => {
    // const name = event.target.value
    if (!this.nameRef.current) {
      return
    }

    const name = this.nameRef.current.value

    if (name && this.state.name !== name) {
      this.setState({ name })
      this.renameList(name)
    }
  }

  createNewTask = async (content: string) => {
    const listId = this.props.listId === 'inbox' ? undefined : this.props.listId
    const { task } = await createTask(content, listId)
    if (task) {
      this.setState(prevState => ({
        tasks: [
          ...prevState.tasks,
          task
        ]
      }))
    }
  }

  updateTaskContent = async (taskId: string, content: string) => {
    const { task } = await updateTask(taskId, content)
    this.updateTaskInState(task)
  }

  handleMarkComplete = async (taskId: string) => {
    const { task } = await completeTask(taskId)
    this.updateTaskInState(task)
  }

  handleMarkIncomplete = async (taskId: string) => {
    const { task } = await reopenTask(taskId)
    this.updateTaskInState(task)
  }

  updateTaskInState = (task: Maybe<TaskType>) => {
    if (task && this.state.tasks) {
      // Update task in set
      this.setState(prevState => ({
        tasks: prevState.tasks.map(t => {
          if (t.id === task.id) {
            return task
          }

          return t
        })
      }))
    }
  }

  renameList = async (name: string) => {
    // TODO handle loading state for name change
    try {
      const data = await renameList(this.props.listId, name)
      const updatedList = data.list
      if (updatedList) {
        this.setState({ name })
      }
    } catch (error) {
      // TODO handle error
      this.setState({ error })
    }
  }

  deleteTask = async (id: string) => {
    try {
      const data = await deleteTask(id)
      if (data.id) {
        // Remove task in set
        this.setState(prevState => ({
          tasks: prevState.tasks.filter(t => t.id !== data.id)
        }))
      }
    } catch (error) {
      // TODO handle error
    }
  }

  handleKeyPress = (event: React.KeyboardEvent<Element>, _value: string, _id: string, index: number) => {
    // TODO: create a new item at this index
    // TODO: potentially split the text at the cursor (i.e. simulate plaintext editing)
    if (event.key === 'Enter') {
      console.log(`TODO: create a new item at ${index + 1}`)
    }
  }

  handleKeyDown = (event: React.KeyboardEvent<Element>, value: string, id: string, index: number) => {
    // Use onKeyDown because we want to check that the value is already empty
    if (event.key === 'Backspace' && value === '') {
      this.deleteTask(id)
      this.focusPreviousTask(index)
    }

    if (event.key === 'ArrowDown') {
      this.focusNextTask(index)
    }

    if (event.key === 'ArrowUp') {
      this.focusPreviousTask(index)
    }
  }

  focusNextTask = (currentIndex: number) => {
    const nextTask = this.state.tasks[currentIndex + 1]
    const autoFocusId = nextTask ? nextTask.id : null
    this.setState({ autoFocusId })
  }

  focusPreviousTask = (currentIndex: number) => {
    const nextTask = this.state.tasks[currentIndex - 1]
    const autoFocusId = nextTask ? nextTask.id : null
    this.setState({ autoFocusId })
  }

  render() {
    const { isLoading, tasks, name, autoFocusId } = this.state

    if (isLoading) {
      return <Container>Loading...</Container>
    }

    const placeholder = 'Untitled'

    return (
      <Container onClick={this.props.requestSideBarClose}>
        <Heading display='flex' paddingBottom={scale(2)} alignItems='center'>
          <Pane display='inline-flex' marginRight={scale(1)} flex='none' className={css`
            @media (min-width: 1224px) {
              display: none;
            }
          `}>
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
              flex='1 0 auto'
              editView={(
                <Input
                  innerRef={this.nameRef}
                  defaultValue={name}
                  placeholder={placeholder}
                  autoFocus
                  width='100%'
                  padding={0}
                  border='none'
                  fontSize='inherit'
                  fontWeight='inherit'
                  fontFamily='inherit'
                  color='inherit'
                  style={{ outline: 'none' }}
                />
              )}
              readView={(
                <Pane>{name || placeholder}</Pane>
              )}
              onConfirm={this.handleNameChange}
            />
          ) : (
            name
          )}
        </Heading>
        {tasks.map((task, index) => (
          <Task
            {...task}
            autoFocus={autoFocusId === task.id}
            key={task.id}
            onContentChange={(content) => this.updateTaskContent(task.id, content)}
            onMarkComplete={() => this.handleMarkComplete(task.id)}
            onMarkIncomplete={() => this.handleMarkIncomplete(task.id)}
            onKeyPress={(event, value) => this.handleKeyPress(event, value, task.id, index)}
            onKeyDown={(event, value) => this.handleKeyDown(event, value, task.id, index)}
            onRequestDelete={() => this.deleteTask(task.id)}
          />
        ))}
        <CreateNewTask onDoneEditing={this.createNewTask} />

        {process.env.NODE_ENV !== 'production' && (
          <Pane width='100%'>
            <hr/>
            <Pane is='pre' overflow='auto' backgroundColor={colors.fill.background} borderRadius={2} padding={scale(1)}>
              <code>
                {JSON.stringify(this.state, null, 2)}
              </code>
            </Pane>
          </Pane>
        )}
      </Container>
    )
  }
}

export default withRouter(ListWithData)
