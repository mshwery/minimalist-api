import React, { PureComponent } from 'react'
import { css, cx } from '@emotion/css'
import { User } from 'react-feather'
import Box from 'ui-box'
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
    imageHasFailedLoading: false,
  }

  handleError = (): void => {
    this.setState({ imageHasFailedLoading: true })
  }

  render(): JSX.Element {
    const { size = 40, src, className, ...props } = this.props

    const imageUnavailable = !src || this.state.imageHasFailedLoading

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
        backgroundColor={colors.fill.background}
        className={cx(
          className,
          css`
            &:after {
              content: ' ';
              position: absolute;
              pointer-events: none;
              width: 100%;
              height: 100%;
              box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
              border-radius: 50%;
            }
          `
        )}
        {...props}
      >
        {imageUnavailable ? (
          <Box borderRadius="50%" display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
            <User size={size / 2} color={colors.text.muted} />
          </Box>
        ) : (
          <img width="auto" height={size} src={src} onError={this.handleError} />
        )}
      </Box>
    )
  }
}
