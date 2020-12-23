import React from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { scale } from './scale'

interface Props {
  icon: React.ElementType
  color?: string
  size?: string | number
}

export const Icon = React.forwardRef<HTMLElement, Props & BaseUIProps>(
  ({ icon: IconComponent, color, size = scale(2.5), ...props }, ref) => {
    return (
      <Box
        cursor="pointer"
        display="inline-flex"
        flex="none"
        alignItems="center"
        justifyContent="center"
        ref={ref}
        {...props}
      >
        <IconComponent color={color} size={size} />
      </Box>
    )
  }
)
