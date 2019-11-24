import React from 'react'
import Box from 'ui-box'
import { noop } from 'lodash'
import { useLockBodyScroll } from 'react-use'
import { X } from 'react-feather'
import { scale } from './scale'
import { Portal } from './Portal'
import { useFocusTrap } from './useFocusTrap'
import { BaseUIProps } from './types'
import { Icon } from './Icon'
import { colors } from './colors'

const Overlay: React.FunctionComponent<{ onClick?: (event: React.SyntheticEvent) => void }> = (props) => {
  return (
    <Box
      {...props}
      backgroundColor='rgba(0, 0, 0, 0.5)'
      position='fixed'
      top={0}
      right={0}
      bottom={0}
      left={0}
      zIndex={999}
    />
  )
}

interface Props {
  hideOnEsc?: boolean
  hideOnClickOutside?: boolean
  isShown?: boolean
  preventBodyScroll?: boolean
  requestClose?: () => void
}

export const Dialog: React.FunctionComponent<Props & BaseUIProps> = ({
  children,
  hideOnEsc = true,
  hideOnClickOutside = true,
  isShown = false,
  preventBodyScroll = true,
  requestClose = noop,
  ...props
}) => {
  const { ref } = useFocusTrap(isShown, {
    onDeactivate: requestClose,
    clickOutsideDeactivates: hideOnClickOutside,
    escapeDeactivates: hideOnEsc
  })

  useLockBodyScroll(preventBodyScroll && isShown)

  if (!isShown) {
    return null
  }

  return (
    <Portal>
      <Overlay>
        <Box
          innerRef={ref}
          role='dialog'
          aria-modal
          tabIndex={-1}
          padding={scale(2)}
          backgroundColor='white'
          borderRadius={4}
          maxHeight='calc(100vh - 24vmin)'
          maxWidth='calc(100vw - 32px)'
          marginX='auto'
          marginTop='12vmin'
          position='relative'
          {...props}
        >
          <Icon
            icon={X}
            position='absolute'
            color={colors.fill.secondary}
            cursor='pointer'
            right={scale(2)}
            top={scale(2)}
            onClick={requestClose}
          />
          {children}
        </Box>
      </Overlay>
    </Portal>
  )
}
