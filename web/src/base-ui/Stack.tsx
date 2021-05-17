import React from 'react'
import Box, { BoxProps } from 'ui-box'

interface StackProps extends Omit<BoxProps<'div'>, 'gap'> {
  direction?: 'row' | 'column'
  gap?: string | number
}

export const Stack: React.FunctionComponent<StackProps> = ({ direction = 'column', gap = '0.5rem', ...props }) => {
  const styles: BoxProps<'div'> = {}
  if (direction === 'column') {
    styles.rowGap = gap
  } else {
    styles.columnGap = gap
  }

  return <Box display="flex" flexDirection={direction} {...styles} {...props} />
}
