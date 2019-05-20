import React from 'react'
import { Maybe } from '../../@types/type-helpers'
import client from '../../lib/graphql-client'
import Lists from './Lists'
import {
  getListsQuery,
  createListMutation,
  List,
  GetListsData,
  CreateListData
} from './queries'

interface State {
  lists: Maybe<List[]>
  error: Maybe<Error>
  isCreatingList: boolean
  isLoading: boolean
}

export default class ListsWithData extends React.PureComponent<{}, State> {
  state = {
    lists: null,
    error: null,
    isCreatingList: false,
    isLoading: true
  }

  async componentDidMount() {
    try {
      const data = await client.request<GetListsData>(getListsQuery)
      this.setState({ lists: data.lists })
    } catch (error) {
      // TODO add frontend Segment + error tracking
      this.setState({ error })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  handleCreateList = async (name: string) => {
    this.setState({ isCreatingList: true })

    let list: null | List = null

    try {
      const { createList } = await client.request<CreateListData>(createListMutation, {
        input: {
          name
        }
      })

      list = createList.list

      if (list !== null) {
        const appended: List[] = Array.from(this.state.lists || [])
        appended.push(list)
        this.setState({ lists: appended })
      }
    } finally {
      this.setState({ isCreatingList: false })
    }

    return list
  }

  render() {
    if (this.state.isLoading) {
      return 'Loading...'
    }

    return (
      <Lists
        lists={this.state.lists || []}
        onCreateList={this.handleCreateList}
        isCreatingList={this.state.isCreatingList}
      />
    )
  }
}
