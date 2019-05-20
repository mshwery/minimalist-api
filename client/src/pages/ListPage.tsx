import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ListDetail from '../components/ListDetail'

export default class ListPage extends Component<RouteComponentProps<{ listId: string }, {}>> {
  render() {
    return (
      <ListDetail listId={this.props.match.params.listId} />
    )
  }
}
