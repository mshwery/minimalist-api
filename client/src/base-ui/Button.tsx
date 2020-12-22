import React, { PureComponent } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { scale } from './scale'
import { colors } from './colors'

const disabledStyles = {
  opacity: 0.5,
  cursor: 'not-allowed'
}

const variants = {
  minimal: {
    background: 'white',
    border: `1px solid ${colors.fill.muted}`,
    color: 'inherit'
  },
  default: {
    background: colors.fill.primary,
    border: `1px solid ${colors.fill.primary}`,
    color: 'white'
  }
}

function getVariantProps(variant: 'minimal' | 'default'): object {
  return variants[variant] || variants.default
}

const sizes = {
  compact: {
    fontSize: '12px',
    lineHeight: 1.6,
    paddingX: scale(2)
  },
  default: {
    fontSize: '14px',
    lineHeight: 2,
    paddingX: scale(2),
    minWidth: scale(10)
  },
  large: {
    fontSize: '16px',
    lineHeight: 2.5,
    paddingX: scale(2),
    minWidth: scale(10)
  }
}

function getSizeProps(size: 'compact' | 'default' | 'large'): object {
  return sizes[size] || sizes.default
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether or not the button should be disabled */
  disabled?: boolean
  /** An (optional) icon to place after the text */
  iconAfter?: React.ReactNode
  /** An (optional) icon to place before the text */
  iconBefore?: React.ReactNode
  /** Whether or not the button should display a loading indicator (it will become disabled unless otherwise specified) */
  isLoading?: boolean
  /** The button style to apply */
  variant?: 'minimal' | 'default'
  /** The size of the button */
  size?: 'compact' | 'default' | 'large'
}

export class Button extends PureComponent<ButtonProps & BaseUIProps> {
  render() {
    const {
      children,
      disabled,
      iconAfter,
      iconBefore,
      isLoading,
      size = 'default',
      variant = 'default',
      ...props
    } = this.props

    const variantProps = getVariantProps(variant)
    const sizeProps = getSizeProps(size)

    return (
      <Box
        is="button"
        type="button"
        alignItems="center"
        appearance="none"
        borderRadius={3}
        boxSizing="border-box"
        cursor="pointer"
        display="inline-flex"
        fontWeight={400}
        justifyContent="center"
        textDecoration="none"
        userSelect="none"
        disabled={isLoading || disabled}
        {...sizeProps}
        {...variantProps}
        {...(isLoading || disabled ? disabledStyles : {})}
        {...props}
      >
        {iconBefore && (
          <Box display="inline-flex" marginRight={scale(1)}>
            {iconBefore}
          </Box>
        )}
        {children}
        {iconAfter && (
          <Box display="inline-flex" marginLeft={scale(1)}>
            {iconAfter}
          </Box>
        )}
      </Box>
    )
  }
}
