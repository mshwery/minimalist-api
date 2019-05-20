import React, { Component } from 'react'
import { Pane, scale } from '../../base-ui'

export default class Sidebar extends Component {
  render() {
    return (
      <Pane flex='none' padding={scale(5)} width={scale(35)} minHeight='100vh' overflowY='auto'>
        {this.props.children}
      </Pane>
    )
  }
}
