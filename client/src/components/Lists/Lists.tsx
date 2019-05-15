import React, { Component } from 'react'
import { Button, Heading, Pane, scale } from '../../base-ui'

interface List {
  id: string
  name: string
}

interface Props {
  isCreatingList?: boolean
  lists: List[]
  onCreateList: (name: string) => Promise<List | null>
}

class Lists extends Component<Props> {
  render() {
    return (
      <Pane>
        <Button width='100%' isLoading={this.props.isCreatingList} onClick={() => this.props.onCreateList('Untitled List')}>
          Create a new List
        </Button>
        <Pane marginY={scale(4)}>
          <Heading size={100} marginBottom={scale(1)}>Your Lists</Heading>
          <Pane is='ul' marginLeft={0} paddingLeft={0}>
            {this.props.lists.map(list => (
              <Pane is='li' listStyle='none' marginY={scale(1)} key={list.id}>
                {list.name}
              </Pane>
            ))}
          </Pane>
        </Pane>
      </Pane>
    )
  }
}

export default Lists
