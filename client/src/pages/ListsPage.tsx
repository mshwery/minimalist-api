import React, { useState, useEffect } from 'react'
import { Route, Switch, RouteComponentProps, useLocation } from 'react-router-dom'
import { Pane, scale } from '../base-ui'
import { Context } from '../components/UserContext/context'
import Lists from '../components/Lists'
import Sidebar from '../components/Sidebar'
import UserMenu from '../components/UserMenu'
import ListPage from '../pages/ListPage'

const ListsPage: React.FunctionComponent<RouteComponentProps<{}, {}> & Context> = ({ user }) => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  // anytime the location changes, reset the sidebar
  useEffect(
    () => {
      setIsOpen(false)
    },
    [location, setIsOpen]
  )

  return (
    <Pane display='flex'>
      <Sidebar isOpen={isOpen}>
        <UserMenu {...user!} marginBottom={scale(8)} />
        <Lists />
      </Sidebar>
      <Switch>
        <Route exact path='/lists/:listId' render={routeProps => (
          <ListPage
            {...routeProps}
            requestSideBar={() => setIsOpen(true)}
            requestSideBarClose={() => setIsOpen(false)}
          />
        )} />
      </Switch>
    </Pane>
  )
}

export default ListsPage
