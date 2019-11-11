import React from 'react'
import { css } from 'emotion'
import { MoreVertical } from 'react-feather'
import { Menu, MenuItem as ReakitMenuItem, MenuDisclosure, useMenuState } from 'reakit'
import { Icon, scale, colors, Card, Text } from '../../base-ui'

const MenuItem: React.FunctionComponent<any> = (props) => (
  <ReakitMenuItem
    {...props}
    as={Text}
    display='block'
    size={300}
    lineHeight={2.5}
    paddingX={scale(1.5)}
    fontWeight={400}
    cursor='pointer'
    color={colors.text.default}
    className={css`
      outline: none;

      &:hover,
      &:focus {
        background-color: ${colors.fill.secondary}30;
      }
    `}
  />
)

interface Props {
  onDeleteList: () => void
  onArchiveList: () => void
}

const ListMenu: React.FunctionComponent<Props> = ({ onDeleteList, onArchiveList }) => {
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
        as={Card}
        elevation={2}
        width={180}
        maxHeight={350}
        overflow='auto'
        paddingY={scale(0.5)}
        marginTop={scale(0.5)}
        className={css`outline: none;`}
      >
        <MenuItem
          {...menu}
          onClick={() => {
            onArchiveList()
            menu.hide()
          }}
        >
          Archive List
        </MenuItem>
        <MenuItem
          {...menu}
          onClick={() => {
            menu.hide()
            onDeleteList()
          }}
        >
          Delete List
        </MenuItem>
      </Menu>
    </>
  )
}

export default ListMenu
