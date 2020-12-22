import React from 'react'
import { Pane, PaneProps } from './Pane'
import { BaseUIProps } from './types'

export const Card = React.forwardRef<HTMLElement, PaneProps & BaseUIProps>((props, ref) => {
  return <Pane background="white" borderRadius={4} {...props} ref={ref} />
})
