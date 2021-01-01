import React, { useState, useRef } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { PlusCircle, Inbox as InboxIcon, Menu as ListIcon } from 'react-feather'
import { Divider, Pane, Dialog, scale, Heading, Button, Input } from '../../base-ui'
import { SidebarItem, SidebarList } from '../Sidebar'

interface List {
  id: string
  name: string
}

interface Props {
  isCreatingList?: boolean
  lists: List[]
  onCreateList: (name: string) => Promise<void>
}

const Lists: React.FunctionComponent<Props> = (props) => {
  const { pathname } = useLocation()
  const nameRef = useRef<HTMLInputElement>(null)
  const [isDialogShown, setIsDialogShown] = useState(false)

  return (
    <Pane>
      <SidebarList>
        <SidebarItem icon={InboxIcon} is={RouterLink} to="/lists/inbox" isSelected={pathname === '/lists/inbox'}>
          Inbox
        </SidebarItem>
        {props.lists.map((list) => (
          <SidebarItem
            icon={ListIcon}
            key={list.id}
            is={RouterLink}
            to={`/lists/${list.id}`}
            isSelected={pathname === `/lists/${list.id}`}
          >
            {list.name}
          </SidebarItem>
        ))}
        <Divider marginY={scale(1)} />
        <SidebarItem icon={PlusCircle} marginY={scale(1)} onClick={() => setIsDialogShown(true)}>
          Create List
        </SidebarItem>
      </SidebarList>

      <Dialog isShown={isDialogShown} requestClose={() => setIsDialogShown(false)} width={scale(60)}>
        <form
          onSubmit={async (event) => {
            event.preventDefault()

            if (nameRef.current && nameRef.current.value) {
              await props.onCreateList(nameRef.current.value)
              // TODO handle errors
              setIsDialogShown(false)
            }
          }}
        >
          <Heading size={300}>Create a list</Heading>
          <Pane marginTop={scale(4)}>
            <Input autoFocus placeholder="Name" ref={nameRef} width="100%" />
          </Pane>
          <Pane display="flex" justifyContent="flex-end" alignItems="center" marginTop={scale(2)}>
            <Button onClick={() => setIsDialogShown(false)} variant="minimal" marginRight={scale(1)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={props.isCreatingList}>
              Create list
            </Button>
          </Pane>
        </form>
      </Dialog>
    </Pane>
  )
}

export default Lists
