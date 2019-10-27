import React from 'react'
import { Pane } from '../../base-ui'

const SidebarList: React.FunctionComponent<React.ComponentProps<typeof Pane>> = (props) => {
  return (
    <Pane role='tablist' {...props} />
  )
}

export default SidebarList
