import React, { Component, InputHTMLAttributes } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'

interface Props extends InputHTMLAttributes<HTMLInputElement> {

}

export class Checkbox extends Component<Props & BaseUIProps> {
  render() {
    return (
      <Box
        {...this.props}
        type='checkbox'
        is='input'
      />
    )
  }
}
