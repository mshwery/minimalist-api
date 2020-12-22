import React from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'

type Elevation = 0 | 1 | 2 | 3 | 4

export interface PaneProps {
  /** How elevated the element should be (manifesting a box-shadow) */
  elevation?: Elevation
}

const shadowLiningColor = '#C7CED4'
const blurryShadowColor = 'rgba(67, 90, 111, 0.47)'
const elevationStyles = [
  `0 0 1px ${shadowLiningColor}`,
  `0 0 1px ${shadowLiningColor}, 0 2px 4px -2px ${blurryShadowColor}`,
  `0 0 1px ${shadowLiningColor}, 0 5px 8px -4px ${blurryShadowColor}`,
  `0 0 1px ${shadowLiningColor}, 0 8px 10px -4px ${blurryShadowColor}`,
  `0 0 1px ${shadowLiningColor}, 0 16px 24px -8px ${blurryShadowColor}`
]

// TODO get from a theme
function getElevationStyle(elevation?: Elevation) {
  if (!elevation || !Number.isInteger(elevation)) {
    return {}
  }

  return {
    boxShadow: elevationStyles[elevation]
  }
}

export const Pane = React.forwardRef<HTMLElement, PaneProps & BaseUIProps>(({
  elevation,
  ...props
}, ref) => {
  return (
    <Box
      {...getElevationStyle(elevation)}
      ref={ref}
      {...props}
    />
  )
})
