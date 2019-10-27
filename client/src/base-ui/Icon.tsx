import React from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'

interface Props {
  icon: React.ElementType
  color?: string
  size?: string | number
}

export const Icon: React.FunctionComponent<Props & BaseUIProps> = ({ icon: IconComponent, color, size, ...props }) => {
  return (
    <Box display='inline-flex' {...props}>
      <IconComponent color={color} size={size} />
    </Box>
  )
}
