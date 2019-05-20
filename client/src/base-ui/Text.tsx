import React, { PureComponent, HTMLAttributes } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { scale } from './scale'

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
  muted: '#C9CACF'
}

function getTextColor(color?: Color) {
  if (!color) {
    return
  }

  return colors[color] || color
}


export class Text extends PureComponent<TextProps & BaseUIProps> {
  render() {
    const { size = 400, color, ...props } = this.props
    const fontSize = getFontSize(size)
    const textColor = getTextColor(color)

    // TODO: lineHeight, fontWeight, letterSpacing, marginTop, fontFamily?, color
    return (
      <Box
        is='span'
        fontSize={fontSize}
        color={textColor}
        {...props}
      />
    )
  }
}
