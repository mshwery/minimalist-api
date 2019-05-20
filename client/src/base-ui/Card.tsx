import React, { PureComponent } from 'react'
import { Pane, PaneProps } from './Pane'
import { BaseUIProps } from './types'

export class Card extends PureComponent<PaneProps & BaseUIProps> {
  render() {
    return <Pane background='white' borderRadius={4} {...this.props} />
  }
}
