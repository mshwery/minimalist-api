import React, { Component } from 'react'
import Lists from '../Lists'
import Login from '../Login'
import UserMenu from '../UserMenu'
import { withUserContext, UserContextProvider } from '../UserContext'
import { Context } from '../UserContext/context'
import { Pane, scale } from '../../base-ui'

class Sidebar extends Component {
  render() {
    return (
      <Pane padding={scale(5)} width={scale(35)} minHeight='100vh'>
        {this.props.children}
      </Pane>
    )
  }
}

class ListWrapper extends Component<Context> {
  render() {
    if (!this.props.user) {
      return <Login googleAuthUrl='/connect/google' />
    }

    return (
      <Sidebar>
        <UserMenu {...this.props.user!} marginBottom={scale(8)} />
        <Lists />
      </Sidebar>
    )
  }
}

const LoginOrList = withUserContext(ListWrapper)

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <UserContextProvider>
            <LoginOrList />
          </UserContextProvider>
        </header>
      </div>
    )
  }
}

export default App
