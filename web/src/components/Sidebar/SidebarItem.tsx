import React, { useCallback } from 'react'
import { css } from '@emotion/css'
import { scale, Card, Icon, colors, Text } from '../../base-ui'

interface Props {
  icon?: React.ElementType
  isSelected?: boolean
}

export const SidebarItem: React.FunctionComponent<Props & React.ComponentProps<typeof Card>> = ({
  children,
  icon,
  isSelected,
  onClick,
  ...props
}) => {
  const onKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (typeof onClick !== 'function') {
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        onClick(event)
      }
    },
    [onClick]
  )

  return (
    <Card
      onKeyPress={onKeyPress}
      onClick={onClick}
      display="flex"
      justifyContent="auto"
      alignItems="center"
      textDecoration="none"
      width="100%"
      paddingY={scale(1)}
      paddingX={scale(1.5)}
      marginX={0}
      marginBottom={scale(0.5)}
      tabIndex={0}
      aria-selected={isSelected}
      role="tab"
      cursor="pointer"
      color={isSelected ? colors.text.action : colors.text.default}
      outline="none"
      className={css`
        background-color: ${isSelected ? 'white' : 'transparent'};

        &:hover,
        &:focus {
          background-color: ${colors.fill.secondary}30;
        }
      `}
      {...props}
    >
      {icon && <Icon icon={icon} size={scale(2)} marginRight={scale(1)} />}
      <Text size={300}>{children}</Text>
    </Card>
  )
}
