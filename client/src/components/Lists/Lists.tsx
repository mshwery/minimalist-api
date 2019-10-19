import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Plus } from 'react-feather'
import { Button, Heading, Pane, scale, Text } from '../../base-ui'

const INBOX = {
  id: 'inbox',
  name: 'Inbox'
}

interface ListLinkProps {
  list: List
}

const ListLink: React.FunctionComponent<ListLinkProps> = ({ list }) => {
  return (
    <Pane is='li' listStyle='none' marginY={scale(1)}>
      <RouterLink to={`/lists/${list.id}`}>
        {list.name}
      </RouterLink>
    </Pane>
  )
}

interface List {
  id: string
  name: string
}

interface Props {
  isCreatingList?: boolean
  lists: List[]
  onCreateList: (name: string) => Promise<void>
}

class Lists extends Component<Props> {
  render() {
    return (
      <Pane>
        <Button width='100%' isLoading={this.props.isCreatingList} onClick={() => this.props.onCreateList('Untitled')}>
          <Plus size={scale(2)} /><Text marginLeft={scale(1)} size={300}>Create a new List</Text>
        </Button>
        <Pane marginY={scale(4)}>
          <Heading size={100} marginBottom={scale(1)}>Lists</Heading>
          <Pane is='ul' marginLeft={0} paddingLeft={0}>
            <ListLink list={INBOX} />
            {this.props.lists.map(list => (
              <ListLink list={list} key={list.id} />
            ))}
          </Pane>
        </Pane>
      </Pane>
    )
  }
}

export default Lists
