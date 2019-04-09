import React from 'react'
import client from '../../lib/graphql-client'
import axios from 'axios'
import Login, { LoginArgs } from './Login'

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
  isLoggingIn: boolean
  wrongEmail: boolean
  wrongPassword: boolean
}

export default class LoginWithData extends React.PureComponent<{}, State> {
  state = {
    currentUser: null,
    error: null,
    isLoading: true,
    isLoggingIn: false,
    wrongEmail: false,
    wrongPassword: false
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

  onLogin = async ({ email, password }: LoginArgs) => {
    this.setState({ error: null, isLoggingIn: true, wrongEmail: false, wrongPassword: false })

    try {
      await axios.post('/api/v1/authenticate', {
        email,
        password
      })
    } catch (error) {
      // TODO: add error tracking here

      if (error.response) {
        const status = error.response.status
        if (status === 404) {
          this.setState({ error, wrongEmail: true })
          return
        }

        if (status === 401) {
          this.setState({ error, wrongPassword: true })
          return
        }
      }

      // otherwise, handle any other errors
      this.setState({ error })
    } finally {
      this.setState({ isLoggingIn: false })
    }
  }

  render() {
    if (this.state.isLoading) {
      return 'Loading...'
    }

    if (this.state.currentUser) {
      return `Logged in as ${JSON.stringify(this.state.currentUser, null, 2)}`
    }

    return (
      <Login
        hasError={Boolean(this.state.error)}
        isLoggingIn={this.state.isLoggingIn}
        onLogin={this.onLogin}
        wrongEmail={this.state.wrongEmail}
        wrongPassword={this.state.wrongPassword}
      />
    )
  }
}
