import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { UserContextProvider } from './components/UserContext'
import PrivateRoute from './components/PrivateRoute'
import ListsPage from './pages/ListsPage'
import LoginPage from './pages/LoginPage'

const App: React.FunctionComponent<{}> = () => (
  <UserContextProvider>
    <Router>
      <main>
        <Switch>
          {/* Temporarily redirect while we have no landing page */}
          <Redirect from='/' to='/lists' exact />
          <Route path='/login' component={LoginPage} />
          <PrivateRoute path='/lists' component={ListsPage} />
        </Switch>
      </main>
    </Router>
  </UserContextProvider>
)

export default App
