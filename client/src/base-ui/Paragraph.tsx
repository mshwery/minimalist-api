import React, { PureComponent, HTMLAttributes } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import scale from './scale'

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {

}

export default class Paragraph extends PureComponent<ParagraphProps & BaseUIProps> {
  render() {
    return (
      <Box
        is='p'
        marginTop={scale(1)}
        {...this.props}
      />
    )
  }
}
