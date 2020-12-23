import React, { PureComponent, HTMLAttributes } from 'react'
import { BaseUIProps } from './types'
import { scale } from './scale'
import { Text } from './Text'

type ParagraphProps = HTMLAttributes<HTMLParagraphElement>

export class Paragraph extends PureComponent<ParagraphProps & BaseUIProps> {
  render() {
    return <Text is="p" marginTop={0} marginBottom={scale(1.5)} {...this.props} />
  }
}
