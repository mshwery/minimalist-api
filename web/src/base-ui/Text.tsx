import React from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { scale } from './scale'
import { colors as theme } from './colors'

type Color = 'muted' | 'default' | string

type TextSize = 300 | 400 | 500 | 600

interface TextProps {
  /** A shorthand for the text color */
  color?: Color
  /** A shorthand for fontSize */
  size?: TextSize
}

const fontSizes: { [key: string]: number } = {
  '200': scale(1.5),
  '300': scale(1.75),
  '400': scale(2),
  '500': scale(2.25),
  '600': scale(2.5),
}

const lineHeights: Record<string, string> = {
  '200': '1.25',
  '300': '1.44',
  '400': '1.4',
  '500': '1.5',
  '600': '1.5',
}

function getFontStyles(size?: number) {
  if (!size) {
    return {
      fontSize: fontSizes[400],
      lineHeight: lineHeights[400],
    }
  }

  return {
    fontSize: fontSizes[size],
    lineHeight: lineHeights[size],
  }
}

const colors: { [key: string]: string } = {
  muted: theme.text.muted,
}

function getTextColor(color?: Color) {
  if (!color) {
    return
  }

  return colors[color] || color
}

export const Text = React.forwardRef<HTMLSpanElement, TextProps & BaseUIProps>(
  ({ size = 400, color, ...props }, ref) => {
    const fontStyles = getFontStyles(size)
    const textColor = getTextColor(color)

    // TODO: fontWeight, letterSpacing, marginTop, fontFamily?, color
    return <Box is="span" ref={ref} {...fontStyles} color={textColor} {...props} />
  }
)
