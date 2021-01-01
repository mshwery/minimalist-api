import React from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { colors } from './colors'

export const Divider: React.FC<React.HTMLAttributes<HTMLHRElement> & BaseUIProps> = (props) => {
  return <Box is="hr" border="none" borderTop="1px solid" color={colors.fill.muted} {...props} />
}
