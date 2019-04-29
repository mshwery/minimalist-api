import React, { PureComponent, HTMLAttributes } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import scale from './scale'

type HeadingSize = 100 | 200 | 300 | 400 | 500 | 600 | 700

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
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

export default class Heading extends PureComponent<HeadingProps & BaseUIProps> {
  render() {
    const { size, ...props } = this.props
    const fontSize = getFontSize(size)

    // TODO: lineHeight, fontWeight, letterSpacing, marginTop, fontFamily?, color
    return (
      <Box
        is='h1'
        fontSize={fontSize}
        fontWeight={600}
        textTransform={size === 100 ? 'uppercase' : 'none'}
        marginTop={0}
        marginBottom={0}
        {...props}
      />
    )
  }
}
