import React, { Component } from 'react'
import { Maybe } from '../../@types/type-helpers'
import client from '../../lib/graphql-client'
import { Provider } from './context'

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

export default class UserProvider extends Component<{}, UserProviderState> {
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
      const data = await client.request<Data>(getCurrentUserQuery)
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
