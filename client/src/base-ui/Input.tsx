import React from 'react'
import { css } from 'emotion'
import { Text } from './Text'
import { scale } from './scale'
import { colors } from './colors'

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Text>>((props, ref) => {
  return (
    <Text
      ref={ref}
      is='input'
      type='text'
      size={300}
      paddingX={scale(1.5)}
      lineHeight={2.25}
      backgroundColor='white'
      borderRadius={3}
      appearance='none'
      border={`1px solid ${colors.fill.muted}`}
      outline='none'
      className={css`
        &:focus {
          border-color: ${colors.fill.primary};
        }
      `}
      {...props}
    />
  )
})
