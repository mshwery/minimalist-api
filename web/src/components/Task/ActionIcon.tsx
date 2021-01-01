import React from 'react'
import { css, cx } from '@emotion/css'
import { Icon, colors } from '../../base-ui'

export const ActionIcon: React.FunctionComponent<React.ComponentProps<typeof Icon>> = ({ className, ...props }) => (
  <Icon
    cursor="pointer"
    alignItems="center"
    justifyContent="center"
    outline="none"
    tabIndex={0}
    className={cx(
      className,
      css`
        height: 32px;

        &:focus {
          box-shadow: 0 0 0 3px ${colors.fill.primary}25;
        }

        @media (max-width: 600px) {
          height: 40px;
        }
      `
    )}
    {...props}
  />
)
