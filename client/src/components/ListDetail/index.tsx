import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { Maybe } from '../../@types/type-helpers'
import { Heading, Pane, scale } from '../../base-ui'
import { List, getList, renameList, createTask, reopenTask, completeTask } from './queries'
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
  nameRef: null | HTMLInputElement = null

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

  handleNameChange = () => {
    if (!this.nameRef) {
      return
    }

    const name = this.nameRef.value
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
            task!
          ]
        }
      }))
    }
  }

  updateTaskContent = async (content: string, id: string) => {
    // const { task } = await updateTask(content, id)
  }

  handleMarkComplete = async (taskId: string) => {
    const { task } = await completeTask(taskId)
  }

  handleMarkIncomplete = async (taskId: string) => {
    const { task } = await reopenTask(taskId)
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

  setNameRef = (node: null | HTMLInputElement) => {
    this.nameRef = node
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
              <Box
                innerRef={this.setNameRef}
                is='input'
                type='text'
                defaultValue={optimisticName}
                placeholder={placeholder}
                autoFocus
                width='100%'
                padding={0}
                border='none'
                fontSize='inherit'
                fontWeight='inherit'
                color='inherit'
                appearance='none'
                borderBottom='2px solid #2e8ae6'
                style={{ outline: 'none' }}
              />
            )}
            readView={(
              <Box borderBottom='2px solid transparent'>
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
            onContentChange={(content) => this.updateTaskContent(content, task.id)}
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

