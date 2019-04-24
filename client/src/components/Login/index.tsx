import React from 'react'
import client from '../../lib/graphql-client'
import Login from './Login'
import { Avatar, Pane, Heading, Text, majorScale } from 'evergreen-ui'

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

    if (this.state.currentUser !== null) {
      const { email = '', image = '', name = '' } = this.state.currentUser || {}
      return (
        <Pane background='white' display='flex' alignItems='center' padding={majorScale(2)} margin='auto' maxWidth={majorScale(50)}>
          {image && <Avatar src={image} size={majorScale(5)} marginRight={majorScale(2)} />}
          <Pane flex='1'>
            <Heading>{name}</Heading>
            <Text>{email}</Text>
          </Pane>
        </Pane>
      )
    }

    return (
      <Login
        googleAuthUrl='/connect/google'
      />
    )
  }
}
