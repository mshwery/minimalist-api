import React, { PureComponent } from 'react'
import Box from 'ui-box'
import { User } from 'react-feather'
import { BaseUIProps } from './types'
import { scale } from './scale'
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
      size,
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
          <Box borderRadius='50%' display='flex' alignItems='center' justifyContent='center' width='100%' height='100%' border={`1px solid ${colors.fill.muted}`}>
            <User size={scale(2.5)} color={colors.fill.muted} />
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
