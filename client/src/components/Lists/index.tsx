import React from 'react'
import { Maybe } from '../../@types/type-helpers'
import Lists from './Lists'
import {
  List,
  getLists,
  createList
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
      const { lists } = await getLists()
      this.setState({ lists })
    } catch (error) {
      // TODO add frontend Segment + error tracking
      this.setState({ error })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  handleCreateList = async (name: string) => {
    this.setState({ isCreatingList: true })

    try {
      const { list } = await createList(name)

      if (list !== null) {
        const appended: List[] = Array.from(this.state.lists || [])
        appended.push(list)
        this.setState({ lists: appended })
      }
    } finally {
      this.setState({ isCreatingList: false })
    }
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
