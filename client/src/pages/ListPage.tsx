import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ListDetail from '../components/ListDetail'

export default class ListPage extends Component<RouteComponentProps<{ listId: string }, {}>> {
  render() {
    const listId = this.props.match.params.listId
    const canEditList = listId !== 'inbox'
    return (
      <ListDetail listId={listId} canEditList={canEditList} />
    )
  }
}
