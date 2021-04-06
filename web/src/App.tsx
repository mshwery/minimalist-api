import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import { Spinner, Pane, ToastProvider } from './base-ui'
import { UserContextProvider } from './components/UserContext'
import PrivateRoute from './components/PrivateRoute'
import * as analytics from './lib/analytics'
import { queryClient } from './lib/query-client'

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
  <ToastProvider>
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
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
                <Route exact path="/login" component={LoginPage} />
                <PrivateRoute path="/lists" component={ListsPage} />
                <Route path="*">
                  <Redirect to="/lists/inbox" />
                </Route>
              </Switch>
            </Suspense>
          </main>
        </Router>
      </QueryClientProvider>
    </UserContextProvider>
  </ToastProvider>
)

export default App
