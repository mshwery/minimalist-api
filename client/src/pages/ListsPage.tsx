import React, { useState } from 'react'
import { Route, Switch, RouteComponentProps } from 'react-router-dom'
import { Pane, scale } from '../base-ui'
import { Context } from '../components/UserContext/context'
import Lists from '../components/Lists'
import Sidebar from '../components/Sidebar'
import UserMenu from '../components/UserMenu'
import ListPage from '../pages/ListPage'

const ListsPage: React.FunctionComponent<RouteComponentProps<{}, {}> & Context> = ({ user }) => {
  const [forceOpen, setForceOpen] = useState(false)

  return (
    <Pane display='flex'>
      <Sidebar forceOpen={forceOpen}>
        <UserMenu {...user!} marginBottom={scale(8)} />
        <Lists />
      </Sidebar>
      <Switch>
        <Route exact path='/lists/:listId' render={routeProps => (
          <ListPage
            {...routeProps}
            requestSideBar={() => setForceOpen(true)}
            requestSideBarClose={() => setForceOpen(false)}
          />
        )} />
      </Switch>
    </Pane>
  )
}

export default ListsPage
