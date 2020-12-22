import React from 'react'
import { Pane } from '../../base-ui'

export const SidebarList: React.FunctionComponent<React.ComponentProps<typeof Pane>> = props => {
  return <Pane role="tablist" {...props} />
}
