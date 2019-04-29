import React, { PureComponent } from 'react'
import Box from 'ui-box'
import { BaseUIProps } from './types'

interface AvatarProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  /** The width/height of the avatar */
  size?: number
  /** The url of the avatar image */
  src?: string
}

interface AvatarState {
  imageHasFailedLoading: boolean
}

export default class Avatar extends PureComponent<AvatarProps & BaseUIProps, AvatarState> {
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
        width={size}
        height={size}
        overflow='hidden'
        borderRadius={9999}
        position='relative'
        display='inline-flex'
        justifyContent='center'
        {...props}
      >
        {!imageUnavailable && (
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
