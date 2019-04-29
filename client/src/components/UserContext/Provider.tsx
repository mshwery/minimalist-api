import React from 'react'
import { Provider } from './context'
import client from '../../lib/graphql-client'

const getCurrentUserQuery = `
  query GetCurrentUser {
    me {
      id
      email
      image
      name
    }
  }
`

type Maybe<T> = T | null

interface Viewer {
  id: string
  email: string
  image: string
  name: string
}

interface Data {
  me: Maybe<Viewer>
}

interface UserProviderState {
  error: Maybe<Error>
  isLoading: boolean
  context: {
    user: Maybe<Viewer>
  }
}

export default class UserProvider extends React.Component<{}, UserProviderState> {
  state = {
    error: null,
    isLoading: true,
    context: {
      user: null,
      refetchUser: this.fetchUser
    }
  }

  componentDidMount() {
    this.fetchUser()
  }

  async fetchUser() {
    try {
      const data: Data = await client.request(getCurrentUserQuery)
      const context = {
        user: data.me,
        refetchUser: this.fetchUser
      }
      this.setState({ context })
    } catch (error) {
      // TODO add frontend Segment + error tracking
      const context = {
        user: null,
        refetchUser: this.fetchUser
      }
      this.setState({ context })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  render() {
    if (this.state.isLoading) {
      return 'Loading...'
    }

    return <Provider value={this.state.context}>{this.props.children}</Provider>
  }
}
