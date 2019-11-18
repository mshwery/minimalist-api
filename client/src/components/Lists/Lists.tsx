import React, { useState, useRef } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { PlusCircle, Inbox as InboxIcon, Menu as ListIcon, X } from 'react-feather'
import { Pane, Dialog, scale, Icon, colors, Heading, Button, Input } from '../../base-ui'
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
  const nameRef = useRef<HTMLInputElement>()
  const [isDialogShown, setIsDialogShown] = useState(false)

  return (
    <Pane>
      <SidebarList>
        <SidebarItem icon={InboxIcon} is={RouterLink} to='/lists/inbox' isSelected={pathname === '/lists/inbox'}>
          Inbox
        </SidebarItem>
        {props.lists.map(list => (
          <SidebarItem icon={ListIcon} key={list.id} is={RouterLink} to={`/lists/${list.id}`} isSelected={pathname === `/lists/${list.id}`}>
            {list.name}
          </SidebarItem>
        ))}
        <SidebarItem icon={PlusCircle} onClick={() => setIsDialogShown(true)}>
          Create List
        </SidebarItem>
      </SidebarList>

      <Dialog isShown={isDialogShown} requestClose={() => setIsDialogShown(false)} width={scale(60)}>
        <Icon
          icon={X}
          position='absolute'
          color={colors.fill.secondary}
          cursor='pointer'
          right={scale(2)}
          top={scale(2)}
          onClick={() => setIsDialogShown(false)}
        />
        <Heading size={300}>Create a list</Heading>
        <Pane marginTop={scale(4)}>
          <Input
            autoFocus
            placeholder='Name'
            innerRef={nameRef}
            width='100%'
          />
        </Pane>
        <Pane display='flex' justifyContent='flex-end' alignItems='center' marginTop={scale(2)}>
          <Button onClick={() => setIsDialogShown(false)} variant='minimal' marginRight={scale(1)}>Cancel</Button>
          <Button
            isLoading={props.isCreatingList}
            onClick={async () => {
              if (nameRef.current) {
                await props.onCreateList(nameRef.current.value)
                // TODO handle errors
                setIsDialogShown(false)
              }
            }}
          >
            Create list
          </Button>
        </Pane>
      </Dialog>
    </Pane>
  )
}

export default Lists
