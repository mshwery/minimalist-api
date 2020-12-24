import React, { PureComponent, HTMLAttributes } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { colors } from './colors'

type LinkProps = HTMLAttributes<HTMLAnchorElement>

export class Link extends PureComponent<LinkProps & BaseUIProps> {
  render(): JSX.Element {
    return <Box is="a" color={colors.text.action} textDecoration="underline" {...this.props} />
  }
}
