import React, { PureComponent } from 'react'
import Box from 'ui-box'
import { User } from 'react-feather'
import { BaseUIProps } from './types'
import { colors } from './colors'

interface AvatarProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  /** The width/height of the avatar */
  size?: number
  /** The url of the avatar image */
  src?: string
}

interface AvatarState {
  imageHasFailedLoading: boolean
}

export class Avatar extends PureComponent<AvatarProps & BaseUIProps, AvatarState> {
  state = {
    imageHasFailedLoading: false
  }

  handleError = () => {
    this.setState({ imageHasFailedLoading: true })
  }

  render() {
    const {
      size = 40,
      src,
      ...props
    } = this.props

    const imageUnavailable = !src || this.state.imageHasFailedLoading

    return (
      <Box
        flex='none'
        width={size}
        height={size}
        overflow='hidden'
        borderRadius={9999}
        position='relative'
        display='inline-flex'
        justifyContent='center'
        {...props}
      >
        {imageUnavailable ? (
          <Box backgroundColor={colors.fill.background} borderRadius='50%' display='flex' alignItems='center' justifyContent='center' width='100%' height='100%'>
            <User size={size / 2} color={colors.text.muted} />
          </Box>
        ) : (
          <Box
            is='img'
            width='auto'
            height='100%'
            src={src}
            onError={this.handleError}
          />
        )}
      </Box>
    )
  }
}
