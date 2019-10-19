import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ListDetail from '../components/ListDetail'

interface Props {
  requestSideBar?: () => void
  requestSideBarClose?: () => void
}

export default class ListPage extends Component<RouteComponentProps<{ listId: string }, {}> & Props> {
  render() {
    const listId = this.props.match.params.listId
    const canEditList = listId !== 'inbox'
    return (
      <ListDetail
        listId={listId}
        canEditList={canEditList}
        requestSideBar={this.props.requestSideBar}
        requestSideBarClose={this.props.requestSideBarClose}
      />
    )
  }
}
