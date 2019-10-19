import React, { PureComponent } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { scale } from './scale'
import { colors } from './colors'

const disabledStyles = {
  opacity: 0.5,
  cursor: 'not-allowed'
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether or not the button should be disabled */
  disabled?: boolean
  /** Whether or not the button should display a loading indicator (it will become disabled unless otherwise specified) */
  isLoading?: boolean
}

export class Button extends PureComponent<ButtonProps & BaseUIProps> {
  render() {
    const {
      disabled,
      isLoading,
      ...props
    } = this.props

    return (
      <Box
        is='button'
        alignItems='center'
        appearance='none'
        background={colors.fill.primary}
        border='none'
        borderRadius={2}
        boxSizing='border-box'
        color='white'
        cursor='pointer'
        display='inline-flex'
        fontSize='14px'
        fontWeight={400}
        justifyContent='center'
        lineHeight={2}
        paddingX={scale(2)}
        textDecoration='none'
        userSelect='none'
        disabled={isLoading || disabled}
        {...((isLoading || disabled) ? disabledStyles : {})}
        {...props}
      />
    )
  }
}
