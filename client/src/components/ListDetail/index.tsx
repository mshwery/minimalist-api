import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { Maybe } from '../../@types/type-helpers'
import { Heading, Pane, scale, Input } from '../../base-ui'
import { List, Task as TaskType, getList, renameList, createTask, reopenTask, completeTask, updateTask } from './queries'
import Task from '../Task'
import InlineEdit from '../InlineEditableTextField'
import Box from 'ui-box'

interface Props {
  listId: string
}

interface State {
  list: Maybe<List>
  name: string
  error: Maybe<Error>
  isLoading: boolean
}

export default class ListWithData extends PureComponent<Props, State> {
  nameRef = React.createRef<HTMLInputElement>()

  state: State = {
    list: null,
    name: '',
    error: null,
    isLoading: true
  }

  componentDidMount() {
    void this.fetchList()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.listId !== prevProps.listId) {
      void this.fetchList()
    }
  }

  fetchList = async () => {
    try {
      const { list } = await getList(this.props.listId)
      this.setState({ list })
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
    const { task } = await createTask(content, this.props.listId)
    if (task) {
      this.setState(prevState => ({
        list: {
          ...prevState.list!,
          tasks: [
            ...prevState.list!.tasks,
            task
          ]
        }
      }))
    }
  }

  updateTaskContent = async (taskId: string, content: string) => {
    const { task } = await updateTask(taskId, content)
    this.updateTaskInList(task)
  }

  handleMarkComplete = async (taskId: string) => {
    const { task } = await completeTask(taskId)
    this.updateTaskInList(task)
  }

  handleMarkIncomplete = async (taskId: string) => {
    const { task } = await reopenTask(taskId)
    this.updateTaskInList(task)
  }

  updateTaskInList = (task: Maybe<TaskType>) => {
    if (task && this.state.list) {
      // Update task in list
      this.setState(prevState => ({
        list: {
          ...prevState.list!,
          tasks: prevState.list!.tasks.map(t => {
            if (t.id === task.id) {
              return task
            }

            return t
          })
        }
      }))
    }
  }

  renameList = async (name: string) => {
    // TODO handle loading state for name change
    try {
      const data = await renameList(this.props.listId, name)
      const updatedList = data.list
      if (updatedList) {
        const updatedName = updatedList.name
        this.setState(prevState => ({
          list: {
            ...prevState.list!,
            name: updatedName
          }
        }))
      }
    } catch (error) {
      // TODO handle error
      this.setState({ error })
    }
  }

  render() {
    const { isLoading, list, name } = this.state

    if (isLoading) {
      return 'Loading...'
    }

    if (!list) {
      return <Redirect to='/lists' />
    }

    const placeholder = 'Untitled'
    const optimisticName = name || list.name

    return (
      <Pane paddingX={scale(10)} paddingY={scale(5)}>
        <Heading>
          <InlineEdit
            editView={(
              <Input
                innerRef={this.nameRef as any}
                defaultValue={optimisticName}
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
              <Box>
                {optimisticName || placeholder}
              </Box>
            )}
            onConfirm={this.handleNameChange}
          />
        </Heading>
        {list.tasks.map(task => (
          <Task
            {...task}
            key={task.id}
            onContentChange={(content) => this.updateTaskContent(task.id, content)}
            onMarkComplete={() => this.handleMarkComplete(task.id)}
            onMarkIncomplete={() => this.handleMarkIncomplete(task.id)}
          />
        ))}
        <Task onContentChange={this.createNewTask} />

        {process.env.NODE_ENV !== 'production' && (
          <React.Fragment>
            <hr/>
            <pre>
              <code>
                {JSON.stringify(list, null, 2)}
              </code>
            </pre>
          </React.Fragment>
        )}
      </Pane>
    )
  }
}

