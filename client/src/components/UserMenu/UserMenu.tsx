import React from 'react'
import { ChevronDown, LogOut } from 'react-feather'
import { colors, scale, Avatar, Pane, Text, Icon, Menu, MenuItem, MenuDisclosure, useMenuState } from '../../base-ui'
import { css } from 'emotion'

interface UserMenuProps {
  email: string
  image: string
  name?: string
  marginBottom?: number
}

export const UserMenu: React.FunctionComponent<UserMenuProps> = ({ email = '', image = '', name = '', marginBottom }) => {
  const menu = useMenuState({ placement: 'top-end' })

  return (
    <>
      <MenuDisclosure
        {...menu}
        as={Pane}
        display='flex'
        alignItems='center'
        marginBottom={marginBottom}
        cursor='pointer'
        outline='none'
      >
        {image && <Avatar src={image} size={scale(5)} marginRight={scale(2)} />}
        <Pane flex='1' display='flex' flexDirection='column' overflow='hidden' marginRight={scale(1)}>
          <Text fontWeight={500} marginY={scale(0.5)}>{name}</Text>
          <Text size={300} color='muted' overflow='hidden' textOverflow='ellipsis'>{email}</Text>
        </Pane>
        <Icon
          icon={ChevronDown}
          color={colors.fill.secondary}
          size={scale(2)}
          marginTop={scale(0.5)}
        />
      </MenuDisclosure>
      <Menu {...menu} aria-label='User Settings' width='100%'>
        <MenuItem
          {...menu}
          onClick={() => {
            window.location.href = '/api/logout'
            menu.hide()
          }}
        >
          <Icon icon={LogOut} size={scale(2)} color={colors.text.muted} marginRight={scale(1)} />
          <Text fontSize='inherit'>Sign out</Text>
        </MenuItem>
      </Menu>
    </>
  )
}
