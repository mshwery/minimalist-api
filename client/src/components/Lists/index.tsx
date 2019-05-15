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
  isCreatingList: boolean
  isLoading: boolean
}

export default class LoginWithData extends React.PureComponent<{}, State> {
  state = {
    lists: null,
    error: null,
    isCreatingList: false,
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
    this.setState({ isCreatingList: true })

    let list: null | List = null

    try {
      const { createList }: CreateListData = await client.request(createListMutation, {
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
      <Lists lists={this.state.lists || []} onCreateList={this.handleCreateList} isCreatingList={this.state.isCreatingList} />
    )
  }
}
