import React, { PureComponent, HTMLAttributes } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'

interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {

}

export class Link extends PureComponent<LinkProps & BaseUIProps> {
  render() {
    return (
      <Box
        is='a'
        textDecoration='underline'
        {...this.props}
      />
    )
  }
}
