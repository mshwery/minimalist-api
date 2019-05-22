import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { Maybe } from '../../@types/type-helpers'
import { Heading, Pane, scale } from '../../base-ui'
import { List, getList, renameList } from './queries'
import Task from '../Task'
import InlineEdit from '../InlineEditableTextField'
import Box from 'ui-box';

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
    if (this.nameRef && this.nameRef.value) {
      this.setState({ name: this.nameRef.value })
      this.renameList(this.nameRef.value)
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
                style={{ outline: 'none' }}
              />
            )}
            readView={(
              optimisticName || placeholder
            )}
            onConfirm={this.handleNameChange}
          />
        </Heading>
        {list.tasks.map(task => (
          <Task key={task.id} {...task} />
        ))}
        <Task />

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

