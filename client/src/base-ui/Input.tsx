import React, { PureComponent } from 'react'
import { css } from 'emotion'
import { Text } from './Text'
import { scale } from './scale'
import { colors } from './colors'

export class Input extends PureComponent<React.ComponentProps<typeof Text>> {
  render() {
    return (
      <Text
        is='input'
        type='text'
        size={300}
        paddingX={scale(1.5)}
        lineHeight={2.25}
        backgroundColor='white'
        borderRadius={3}
        appearance='none'
        border={`1px solid ${colors.fill.muted}`}
        className={css`
          outline: none;

          &:focus {
            border-color: ${colors.fill.primary};
          }
        `}
        {...this.props}
      />
    )
  }
}
