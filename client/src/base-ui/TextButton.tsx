import React from 'react'
import { Text } from './Text'

const disabledStyles = {
  opacity: 0.5,
  cursor: 'not-allowed'
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
  ...props
}) => {
  return (
    <Text
      is='button'
      alignItems='center'
      appearance='none'
      background='transparent'
      border='none'
      boxSizing='border-box'
      color='currentColor'
      cursor='pointer'
      display='inline-flex'
      fontSize='inherit'
      fontWeight={400}
      justifyContent='center'
      padding={0}
      textDecoration='none'
      userSelect='none'
      disabled={isLoading || disabled}
      {...((isLoading || disabled) ? disabledStyles : {})}
      {...props}
    />
  )
}
