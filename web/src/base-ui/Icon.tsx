import React from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { scale } from './scale'
import { css, cx } from '@emotion/css'

interface Props {
  icon: React.ElementType
  color?: string
  size?: string | number
  isInteractive?: boolean
  interactiveColor?: string
}

export const Icon = React.forwardRef<HTMLElement, Props & BaseUIProps>(
  (
    { icon: IconComponent, className, color, isInteractive, interactiveColor = 'inherit', size = scale(2.5), ...props },
    ref
  ) => {
    return (
      <Box
        cursor="pointer"
        display="inline-flex"
        flex="none"
        alignItems="center"
        justifyContent="center"
        ref={ref}
        className={cx(
          className,
          css`
            color: ${color};

            &:hover,
            &:focus {
              color: ${isInteractive ? interactiveColor : color};
            }
          `
        )}
        {...props}
      >
        <IconComponent size={size} />
      </Box>
    )
  }
)
