import React from 'react'
import { css, cx } from 'emotion'
import { Menu as ReakitMenu, MenuItem as ReakitMenuItem, MenuDisclosure, useMenuState, MenuStateReturn } from 'reakit'
import { scale, colors, Card, Text } from '../base-ui'

export { MenuDisclosure, useMenuState }

export const MenuItem: React.FunctionComponent<MenuStateReturn & React.ComponentProps<typeof Text>> = (props) => (
  <ReakitMenuItem
    {...props}
    as={Text}
    display='flex'
    alignItems='center'
    size={300}
    lineHeight={2.6}
    paddingX={scale(1.5)}
    fontWeight={400}
    cursor='pointer'
    color={colors.text.default}
    outline='none'
    className={cx(props.className, css`
      &:hover,
      &:focus {
        background-color: ${colors.fill.secondary}30;
      }
    `)}
  />
)

export const Menu: React.FunctionComponent<MenuStateReturn & React.ComponentProps<typeof Card>> = (props) => {
  return (
    <ReakitMenu
      {...props}
      as={Card}
      elevation={2}
      width={180}
      maxHeight={350}
      overflow='auto'
      paddingY={scale(0.5)}
      marginTop={scale(0.5)}
      outline='none'
    />
  )
}
