import React, { PureComponent } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'

export class Input extends PureComponent<BaseUIProps> {
  render() {
    return (
      <Box
        is='input'
        type='text'
        {...this.props}
      />
    )
  }
}
