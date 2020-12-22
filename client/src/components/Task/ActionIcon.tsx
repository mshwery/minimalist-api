import React from 'react'
import { css, cx } from 'emotion'
import { Icon } from '../../base-ui'

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
        height: 30px;

        &:focus {
          box-shadow: 0 0 0 2px rgba(16, 112, 202, 0.25);
        }

        @media (max-width: 600px) {
          height: 36px;
        }
      `
    )}
    {...props}
  />
)
