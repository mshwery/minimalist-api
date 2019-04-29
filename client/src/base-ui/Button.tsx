import React, { PureComponent } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import scale from './scale'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether or not the button should display a loading indicator (it will become disabled unless otherwise specified) */
  isLoading?: boolean
}

export default class Button extends PureComponent<ButtonProps & BaseUIProps> {
  render() {
    const {
      isLoading,
      ...props
    } = this.props

    return (
      <Box
        is='button'
        appearance='none'
        background='#2e8ae6'
        border='none'
        fontSize='14px'
        color='white'
        borderRadius={2}
        paddingX={scale(2)}
        lineHeight={2}
        cursor='pointer'
        disabled={isLoading}
        {...props}
      />
    )
  }
}
