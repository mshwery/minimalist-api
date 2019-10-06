import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { Maybe } from '../../@types/type-helpers'
import { Heading, Pane, scale, Input } from '../../base-ui'
import { List, Task as TaskType, getList, renameList, createTask, reopenTask, completeTask, updateTask, getTasks } from './queries'
import Task from '../Task'
import InlineEdit from '../InlineEditableTextField'
import AddTaskButton from './AddTaskButton'

interface Props {
  listId: string
  canEditList?: boolean
}

interface State {
  list: Maybe<List>
  tasks: TaskType[],
  name: string
  error: Maybe<Error>
  isLoading: boolean
}

export default class ListWithData extends PureComponent<Props, State> {
  nameRef = React.createRef<HTMLInputElement>()

  state: State = {
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
        this.setState({ list, name: list ? list.name : '' })
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

  render() {
    const { isLoading, list, tasks, name } = this.state

    if (isLoading) {
      return 'Loading...'
    }

    if (!list && this.props.listId !== 'inbox') {
      return <Redirect to='/lists' />
    }

    const placeholder = 'Untitled'

    return (
      <Pane paddingX={scale(10)} paddingY={scale(5)}>
        <Heading paddingBottom={scale(2)}>
          {this.props.canEditList ? (
            <InlineEdit
              editView={(
                <Input
                  innerRef={this.nameRef as any}
                  defaultValue={name}
                  placeholder={placeholder}
                  autoFocus
                  width='100%'
                  padding={0}
                  border='none'
                  fontSize='inherit'
                  fontWeight='inherit'
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
        {tasks.map(task => (
          <Task
            {...task}
            key={task.id}
            onContentChange={(content) => this.updateTaskContent(task.id, content)}
            onMarkComplete={() => this.handleMarkComplete(task.id)}
            onMarkIncomplete={() => this.handleMarkIncomplete(task.id)}
          />
        ))}
        <AddTaskButton marginTop={scale(1)} onClick={() => this.createNewTask(' ')} />

        {process.env.NODE_ENV !== 'production' && (
          <React.Fragment>
            <hr/>
            <pre>
              <code>
                {JSON.stringify(this.state, null, 2)}
              </code>
            </pre>
          </React.Fragment>
        )}
      </Pane>
    )
  }
}

