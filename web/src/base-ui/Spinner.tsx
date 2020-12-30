import React from 'react'
import Box from 'ui-box'
import { css, keyframes } from '@emotion/css'
import { colors } from './colors'

const showAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const rotateAnimation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

interface Props {
  showDelay?: number
}

export const Spinner: React.FC<Props> = ({ showDelay = 0 }) => {
  const [isShown, setIsShown] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsShown(true), showDelay)

    return () => {
      clearTimeout(timer)
    }
  }, [showDelay])

  if (!isShown) {
    return null
  }

  return (
    <Box
      is="svg"
      viewBox="0 0 24 24"
      position="relative"
      display="flex"
      width={24}
      height={24}
      color={colors.text.muted}
      className={css`
        transform-origin: 50% 50%;
        transition-timing-function: ease;
        transition-property: opacity, transform;
        animation: ${showAnimation} 250ms normal ease, ${rotateAnimation} 0.6s linear infinite;
      `}
    >
      <g transform="translate(1 1)" fillRule="nonzero" fill="none">
        <circle cx="11" cy="11" r="11" />
        <path
          d="M10.998 22a.846.846 0 0 1 0-1.692 9.308 9.308 0 0 0 0-18.616 9.286 9.286 0 0 0-7.205 3.416.846.846 0 1 1-1.31-1.072A10.978 10.978 0 0 1 10.998 0c6.075 0 11 4.925 11 11s-4.925 11-11 11z"
          fill="currentColor"
        />
      </g>
    </Box>
  )
}
