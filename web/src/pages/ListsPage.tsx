import React, { useState, useEffect } from 'react'
import { Route, Switch, RouteComponentProps, useLocation, Redirect } from 'react-router-dom'
import { Pane, scale } from '../base-ui'
import { Context } from '../components/UserContext/context'
import Lists from '../components/Lists'
import { Sidebar } from '../components/Sidebar'
import UserMenu from '../components/UserMenu'

const ListPage = React.lazy(() => import('./ListPage'))

const ListsPage: React.FunctionComponent<RouteComponentProps<{}, {}> & Context> = ({ user }) => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  // anytime the location changes, reset the sidebar
  useEffect(() => {
    setIsOpen(false)
  }, [location, setIsOpen])

  return (
    <Pane display="flex" maxWidth="100vw" maxHeight="100vh" overflow="hidden">
      <Sidebar isOpen={isOpen} requestSideBarClose={() => setIsOpen(false)}>
        {user && <UserMenu {...user} marginBottom={scale(4)} />}
        <Lists />
      </Sidebar>
      <Pane flex="1" maxHeight="100%" overflowY="auto" overflowX="hidden">
        <Switch>
          <Redirect from="/lists" to="/lists/inbox" exact />
          <Route
            exact
            path="/lists/:listId"
            render={(routeProps) => (
              <ListPage
                {...routeProps}
                requestSideBar={() => setIsOpen(true)}
                requestSideBarClose={() => setIsOpen(false)}
              />
            )}
          />
        </Switch>
      </Pane>
    </Pane>
  )
}

export default ListsPage
