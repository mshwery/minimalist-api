import React, { PureComponent, HTMLAttributes } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { scale } from './scale'

type Color = 'muted' | 'default' | string

type HeadingSize = 100 | 200 | 300 | 400 | 500 | 600 | 700

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** A shorthand for the text color */
  color?: Color
  /** A shorthand for fontSize */
  size?: HeadingSize
}

const fontSizes: { [key: string]: number } = {
  '100': scale(1.75),
  '200': scale(2),
  '300': scale(2.5),
  '400': scale(3),
  '500': scale(3.5),
  '600': scale(4),
  '700': scale(5)
}

function getFontSize(size?: number) {
  if (!size) {
    return fontSizes[600]
  }

  return fontSizes[size]
}

function getTextColor(color?: Color) {
  return color
}

export class Heading extends PureComponent<HeadingProps & BaseUIProps> {
  render() {
    const { size, color, ...props } = this.props
    const textColor = getTextColor(color)
    const fontSize = getFontSize(size)

    // TODO: lineHeight, fontWeight, letterSpacing, marginTop, fontFamily?, color
    return (
      <Box
        is="h1"
        color={textColor}
        fontSize={fontSize}
        fontWeight={500}
        textTransform={size === 100 ? 'uppercase' : 'none'}
        marginTop={0}
        marginBottom={0}
        {...props}
      />
    )
  }
}
