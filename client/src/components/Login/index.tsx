import React from 'react'
import client from '../../lib/graphql-client'
// import Login from './Login'

const getCurrentUserQuery = `
  query GetCurrentUser {
    me {
      id
      email
    }
  }
`

type Maybe<T> = T | null

interface Data {
  me: Maybe<{
    id: string
    email: string
  }>
}

interface Viewer {
  id: string
  email: string
}

interface State {
  currentUser: Maybe<Viewer>
  error: Maybe<Error>
  isLoading: boolean
}

export default class LoginWithData extends React.PureComponent<{}, State> {
  state = {
    currentUser: null,
    error: null,
    isLoading: true
  }

  async componentDidMount() {
    try {
      const data: Data = await client.request(getCurrentUserQuery)
      this.setState({ currentUser: data.me })
    } catch (error) {
      // TODO add frontend Segment + error tracking
      this.setState({ error })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  render() {
    if (this.state.isLoading) {
      return 'Loading...'
    }

    if (this.state.error) {
      return 'Dang, it failed.'
    }

    return (
      'Hello!'
    )
  }
}
