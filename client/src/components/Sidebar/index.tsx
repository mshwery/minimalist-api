import React from 'react'
import { css } from 'emotion'
import { useMediaQuery } from 'react-responsive'
import { Pane, scale, colors } from '../../base-ui'

interface Props {
  isOpen?: boolean
}

const Sidebar: React.FunctionComponent<Props> = ({ children, isOpen }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  return (
    <Pane
      backgroundColor={colors.fill.background}
      flex='none'
      width={scale(35)}
      minHeight='100vh'
      overflowY='auto'
      padding={scale(3)}
      className={css`
        margin-left: ${isTabletOrMobile && !isOpen ? `-${scale(35)}px` : 0};
        transition: margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;

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
