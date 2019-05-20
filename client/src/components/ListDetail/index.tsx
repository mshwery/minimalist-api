import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { Maybe } from '../../@types/type-helpers'
import client from '../../lib/graphql-client'
import { Heading, Pane, scale } from '../../base-ui'
import {
  getListQuery,
  List,
  GetListData
} from './queries'
import Task from '../Task'

interface Props {
  listId: string
}

interface State {
  list: Maybe<List>
  error: Maybe<Error>
  isLoading: boolean
}

export default class ListWithData extends PureComponent<Props, State> {
  state: State = {
    list: null,
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
      const { list } = await client.request<GetListData>(getListQuery, { id: this.props.listId })
      this.setState({ list })
    } catch (error) {
      // TODO add frontend Segment + error tracking
      this.setState({ error })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  render() {
    const { isLoading, list } = this.state

    if (isLoading) {
      return 'Loading...'
    }

    if (!list) {
      return <Redirect to='/lists' />
    }

    return (
      <Pane paddingX={scale(10)} paddingY={scale(5)}>
        <Heading color={list.name === 'Untitled List' ? 'muted' : 'default'}>
          {list.name}
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

