import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Spinner, Pane } from './base-ui'
import { UserContextProvider } from './components/UserContext'
import PrivateRoute from './components/PrivateRoute'
// import withSuspense from './components/withSuspense'
import * as analytics from './lib/analytics'

const ListsPage = React.lazy(() => import('./pages/ListsPage'))
const LoginPage = React.lazy(() => import('./pages/LoginPage'))

function trackPageView() {
  analytics.page()
  return null
}

const Container: React.FC = (props) => {
  return <Pane width="100vw" height="100vh" display="flex" alignItems="center" justifyContent="center" {...props} />
}

const App: React.FunctionComponent<{}> = () => (
  <UserContextProvider>
    <Router>
      <Route component={trackPageView} />
      <main>
        <Suspense
          fallback={
            <Container>
              <Spinner />
            </Container>
          }
        >
          <Switch>
            {/* Temporarily redirect while we have no landing page */}
            <Redirect from="/" to="/lists/inbox" exact />
            <Route path="/login" component={LoginPage} />
            <PrivateRoute path="/lists" component={ListsPage} />
          </Switch>
        </Suspense>
      </main>
    </Router>
  </UserContextProvider>
)

export default App
