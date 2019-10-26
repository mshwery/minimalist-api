import React, { HTMLAttributes } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { scale } from './scale'
import { colors as theme } from './colors'

type Color = 'muted' | 'default' | string

type TextSize = 300 | 400 | 500 | 600

interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  /** A shorthand for the text color */
  color?: Color
  /** A shorthand for fontSize */
  size?: TextSize
}

const fontSizes: { [key: string]: number } = {
  '300': scale(1.75),
  '400': scale(2),
  '500': scale(2.25),
  '600': scale(2.5)
}

function getFontSize(size?: number) {
  if (!size) {
    return fontSizes[400]
  }

  return fontSizes[size]
}

const colors: { [key: string]: string } = {
  muted: theme.text.muted
}

function getTextColor(color?: Color) {
  if (!color) {
    return
  }

  return colors[color] || color
}

export const Text: React.FunctionComponent<TextProps & BaseUIProps> = React.forwardRef(({ size = 400, color, ...props }, ref) => {
  const fontSize = getFontSize(size)
  const textColor = getTextColor(color)

  // TODO: lineHeight, fontWeight, letterSpacing, marginTop, fontFamily?, color
  return (
    <Box
      is='span'
      innerRef={ref as React.RefObject<HTMLSpanElement>}
      fontSize={fontSize}
      color={textColor}
      {...props}
    />
  )
})
