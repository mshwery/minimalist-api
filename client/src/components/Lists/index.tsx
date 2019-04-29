import React from 'react'
import client from '../../lib/graphql-client'
import Lists from './Lists'

const getCurrentUserQuery = `
  query GetLists {
    lists {
      id
      name
    }
  }
`

const createListMutation = `
  mutation createList($input: CreateListInput!) {
    createList(input: $input) {
      list {
        id
        name
      }
    }
  }
`

type Maybe<T> = T | null

interface List {
  id: string
  name: string
}

interface GetListsData {
  lists: List[]
}

interface CreateListData {
  createList: {
    list: Maybe<List>
  }
}

interface State {
  lists: Maybe<List[]>
  error: Maybe<Error>
  isLoading: boolean
}

export default class LoginWithData extends React.PureComponent<{}, State> {
  state = {
    lists: null,
    error: null,
    isLoading: true
  }

  async componentDidMount() {
    try {
      const data: GetListsData = await client.request(getCurrentUserQuery)
      this.setState({ lists: data.lists })
    } catch (error) {
      // TODO add frontend Segment + error tracking
      this.setState({ error })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  handleCreateList = async (name: string) => {
    const { createList }: CreateListData = await client.request(createListMutation, {
      input: {
        name
      }
    })

    if (createList.list !== null) {
      const appended: List[] = Array.from(this.state.lists || [])
      appended.push(createList.list)
      this.setState({ lists: appended })
    }

    return createList.list
  }

  render() {
    if (this.state.isLoading) {
      return 'Loading...'
    }

    return (
      <Lists lists={this.state.lists || []} onCreateList={this.handleCreateList} />
    )
  }
}
