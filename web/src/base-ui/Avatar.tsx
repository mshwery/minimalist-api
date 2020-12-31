import React from 'react'
import { User } from 'react-feather'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { colors } from './colors'
import { Text } from './Text'

export interface AvatarProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  /** The width/height of the avatar */
  size?: number
  /** The url of the avatar image */
  src?: string
}

export const Avatar: React.FC<AvatarProps & BaseUIProps> = ({ children, size = 40, src, className, ...props }) => {
  const [imageFailedToLoad, setImageFailedToLoad] = React.useState(false)
  const imageUnavailable = !src || imageFailedToLoad

  const handleImageError = React.useCallback(() => {
    setImageFailedToLoad(true)
  }, [])

  return (
    <Box
      flex="none"
      width={size}
      height={size}
      overflow="hidden"
      borderRadius={9999}
      position="relative"
      display="inline-flex"
      justifyContent="center"
      backgroundColor={colors.neutral[200]}
      {...props}
    >
      {imageUnavailable ? (
        <Text
          color="muted"
          size={300}
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          {children || <User size={size / 2} color="currentColor" />}
        </Text>
      ) : (
        <img width="auto" height="100%" src={src} onError={handleImageError} />
      )}
    </Box>
  )
}
