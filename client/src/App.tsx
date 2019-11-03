import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { UserContextProvider } from './components/UserContext'
import PrivateRoute from './components/PrivateRoute'
import ListsPage from './pages/ListsPage'
import LoginPage from './pages/LoginPage'
import * as analytics from './lib/analytics'

function trackPageView() {
  analytics.page()
  return null
}

const App: React.FunctionComponent<{}> = () => (
  <UserContextProvider>
    <Router>
      <Route component={trackPageView} />
      <main>
        <Switch>
          {/* Temporarily redirect while we have no landing page */}
          <Redirect from='/' to='/lists/inbox' exact />
          <Route path='/login' component={LoginPage} />
          <PrivateRoute path='/lists' component={ListsPage} />
        </Switch>
      </main>
    </Router>
  </UserContextProvider>
)

export default App
