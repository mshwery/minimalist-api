import React from 'react'
import { css } from 'emotion'
import { scale, Card, Icon, colors, Text } from '../../base-ui'

interface Props {
  icon?: React.ElementType
  isSelected?: boolean
}

const SidebarItem: React.FunctionComponent<Props & React.ComponentProps<typeof Card>> = ({ children, icon, isSelected, ...props }) => {
  return (
    <Card
      display='flex'
      justifyContent='auto'
      alignItems='center'
      textDecoration='none'
      width='100%'
      lineHeight={2}
      paddingX={scale(1)}
      marginX={0}
      marginBottom={scale(0.5)}
      tabIndex={0}
      aria-selected={isSelected}
      role='tab'
      cursor='pointer'
      color={colors.text.default}
      className={css`
        font-weight: ${isSelected ? 500 : 'normal'};
        outline: none;
        background-color: ${isSelected ? `${colors.fill.primary}30` : 'transparent'};

        &:hover {
          background-color: ${colors.fill.secondary}30;
        }

        &:focus {
          background-color: ${colors.fill.primary}30;
        }
      `}
      {...props}
    >
      {icon && <Icon color={colors.text.muted} icon={icon} size={scale(2)} marginRight={scale(1)} />}
      <Text size={400}>{children}</Text>
    </Card>
  )
}

export default SidebarItem
