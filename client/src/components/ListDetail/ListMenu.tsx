import React from 'react'
import { MoreVertical, Trash2, Archive } from 'react-feather'
import { Icon, scale, colors, Text, Menu, MenuItem, MenuDisclosure, useMenuState } from '../../base-ui'

interface Props {
  onDeleteList: () => void
  onArchiveList: () => void
}

export const ListMenu: React.FunctionComponent<Props> = ({ onDeleteList, onArchiveList }) => {
  const menu = useMenuState({ placement: 'top-end' })

  return (
    <>
      <MenuDisclosure
        {...menu}
        as={Icon}
        icon={MoreVertical}
        color={colors.fill.muted}
      />
      <Menu
        {...menu}
        aria-label='List Settings'
      >
        <MenuItem
          {...menu}
          onClick={() => {
            onArchiveList()
            menu.hide()
          }}
        >
          <Icon icon={Archive} size={scale(2)} color={colors.text.muted} marginRight={scale(1)} />
          <Text fontSize='inherit'>Archive List</Text>
        </MenuItem>
        <MenuItem
          {...menu}
          onClick={() => {
            menu.hide()
            onDeleteList()
          }}
        >
          <Icon icon={Trash2} size={scale(2)} color={colors.text.muted} marginRight={scale(1)} />
          <Text fontSize='inherit'>Delete List</Text>
        </MenuItem>
      </Menu>
    </>
  )
}
