import React, { Component } from 'react'
import { Route, Switch, RouteComponentProps } from 'react-router-dom'
import { Pane, scale } from '../base-ui'
import { Context } from '../components/UserContext/context'
import Lists from '../components/Lists'
import Sidebar from '../components/Sidebar'
import UserMenu from '../components/UserMenu'
import ListPage from '../pages/ListPage'

export default class ListsPage extends Component<RouteComponentProps<{}, {}> & Context> {
  render() {
    return (
      <Pane display='flex'>
        <Sidebar>
          <UserMenu {...this.props.user!} marginBottom={scale(8)} />
          <Lists />
        </Sidebar>
        <Switch>
          <Route path='/lists/:listId' component={ListPage} />
        </Switch>
      </Pane>
    )
  }
}
