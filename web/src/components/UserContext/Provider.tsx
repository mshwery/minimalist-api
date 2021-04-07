import React, { Component } from 'react'
import { Maybe } from '../../@types/type-helpers'
import client, { gql } from '../../lib/graphql-client'
import { identify } from '../../lib/analytics'
import { Provider, Context } from './context'

const getCurrentUserQuery = gql`
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
  context: Context
}

export default class UserProvider extends Component<{}, UserProviderState> {
  state = {
    error: null,
    isLoading: true,
    context: {
      user: null,
      unsetUser: this.unsetUser,
      refetchUser: this.fetchUser,
    },
  }

  constructor(props = {}) {
    super(props)
    this.unsetUser = this.unsetUser.bind(this)
    this.fetchUser = this.fetchUser.bind(this)
  }

  componentDidMount(): void {
    void this.fetchUser()
  }

  unsetUser(): void {
    this.setState({
      context: {
        user: null,
        unsetUser: this.unsetUser,
        refetchUser: this.fetchUser,
      },
    })
  }

  async fetchUser(): Promise<void> {
    try {
      const { me: user } = await client.request<Data>(getCurrentUserQuery)
      const context = {
        user,
        unsetUser: this.unsetUser,
        refetchUser: this.fetchUser,
      }

      if (user) {
        identify(user.id, {
          email: user.email,
          name: user.name,
        })
      }

      this.setState({ context })
    } catch (error) {
      // TODO add frontend Segment + error tracking
      this.unsetUser()
    } finally {
      this.setState({ isLoading: false })
    }
  }

  render(): JSX.Element | null {
    if (this.state.isLoading) {
      return null
    }

    return <Provider value={this.state.context}>{this.props.children}</Provider>
  }
}
