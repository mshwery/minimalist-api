import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Pane, scale } from './base-ui'
import Lists from './components/Lists'
import Login from './components/Login'
import UserMenu from './components/UserMenu'
import { UserContextProvider } from './components/UserContext'
import { Context } from './components/UserContext/context'
import PrivateRoute from './components/PrivateRoute'

class Sidebar extends Component {
  render() {
    return (
      <Pane padding={scale(5)} width={scale(35)} minHeight='100vh'>
        {this.props.children}
      </Pane>
    )
  }
}

const LoginWrapper = () => (
  <Login googleAuthUrl='/connect/google' />
)

class ListWrapper extends Component<Context> {
  render() {
    return (
      <Sidebar>
        <UserMenu {...this.props.user!} marginBottom={scale(8)} />
        <Lists />
      </Sidebar>
    )
  }
}

const App = () => (
  <UserContextProvider>
    <Router>
      <main>
        <Switch>
          {/* Temporarily redirect while we have no landing page */}
          <Redirect from='/' to='/dashboard' exact />
          <Route path='/login' component={LoginWrapper} />
          <PrivateRoute path='/dashboard' exact component={ListWrapper} />
        </Switch>
      </main>
    </Router>
  </UserContextProvider>
)

export default App
