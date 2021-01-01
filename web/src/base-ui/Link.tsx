import React, { HTMLAttributes } from 'react'
import { css, cx } from '@emotion/css'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { colors } from './colors'

type LinkProps = HTMLAttributes<HTMLAnchorElement>

export const Link: React.FC<LinkProps & BaseUIProps> = ({ className, ...props }) => {
  return (
    <Box
      is="a"
      color={colors.text.action}
      textDecoration="underline"
      {...props}
      className={cx(
        className,
        css`
          &:focus {
            box-shadow: 0 0 0 3px ${colors.fill.primary}25;
          }
        `
      )}
    />
  )
}
