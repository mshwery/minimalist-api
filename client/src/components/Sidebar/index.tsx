import React from 'react'
import { css } from 'emotion'
import { useMediaQuery } from 'react-responsive'
import { Pane, scale, colors } from '../../base-ui'

interface Props {
  forceOpen?: boolean
}

const Sidebar: React.FunctionComponent<Props> = ({ children, forceOpen }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  if (isTabletOrMobile && !forceOpen) {
    return null
  }

  return (
    <Pane
      backgroundColor={colors.fill.background}
      flex='none'
      width={scale(35)}
      minHeight='100vh'
      overflowY='auto'
      padding={scale(5)}
      className={css`
        padding: ${scale(5)}px;

        @media (max-width: 1224px) {
          padding: ${scale(4)}px ${scale(2)}px;
        }
      `}
    >
      {children}
    </Pane>
  )
}

export default Sidebar
