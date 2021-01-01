import React from 'react'
import { css, cx } from '@emotion/css'
import { Text } from './Text'
import { colors } from './colors'

const disabledStyles = {
  opacity: 0.5,
  cursor: 'not-allowed',
}

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether or not the button should be disabled */
  disabled?: boolean
  /** Whether or not the button should display a loading indicator (it will become disabled unless otherwise specified) */
  isLoading?: boolean
}

export const TextButton: React.FunctionComponent<TextButtonProps & React.ComponentProps<typeof Text>> = ({
  disabled,
  isLoading,
  className,
  ...props
}) => {
  return (
    <Text
      is="button"
      alignItems="center"
      appearance="none"
      background="transparent"
      border="none"
      color="currentColor"
      cursor="pointer"
      display="inline-flex"
      fontSize="inherit"
      fontWeight={500}
      justifyContent="center"
      padding={0}
      textDecoration="none"
      userSelect="none"
      disabled={isLoading || disabled}
      {...(isLoading || disabled ? disabledStyles : {})}
      {...props}
      className={cx(
        className,
        css`
          &:focus {
            box-shadow: 0 0 0 3px ${colors.fill.primary}25;
          }
        `
      )}
    />
  )
}
