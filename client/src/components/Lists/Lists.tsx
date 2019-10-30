import React, { useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { PlusCircle, Inbox as InboxIcon, Menu as ListIcon } from 'react-feather'
import { Pane, Dialog, scale } from '../../base-ui'
import SidebarItem from '../Sidebar/SidebarItem'
import SidebarList from '../Sidebar/SidebarList'

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

      <Dialog isShown={isDialogShown} requestClose={() => setIsDialogShown(false)} maxWidth={scale(80)}>
        Dialog
      </Dialog>
    </Pane>
  )
}

export default Lists
