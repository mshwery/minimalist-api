import React, { HTMLAttributes } from 'react'
import { css, cx } from '@emotion/css'
import { lighten } from 'color2k'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { colors } from './colors'

type LinkProps = HTMLAttributes<HTMLAnchorElement>

export const Link: React.FC<LinkProps & BaseUIProps> = ({ className, ...props }) => {
  return (
    <Box
      is="a"
      color={colors.text.action}
      textDecoration="none"
      cursor="pointer"
      {...props}
      className={cx(
        className,
        css`
          &:hover,
          &:focus {
            color: ${lighten(colors.blue.base, 0.1)};
            text-decoration: underline;
          }

          &:focus {
            box-shadow: 0 0 0 3px ${colors.fill.primary}25;
          }
        `
      )}
    />
  )
}
