import React, { ReactChild } from 'react'
import { Pane } from './Pane'
import { Avatar, AvatarProps } from './Avatar'
import { BaseUIProps } from './types'

interface AvatarGroupProps extends BaseUIProps {
  size?: AvatarProps['size']
  max?: number
  children: ReactChild[]
}

export function getValidChildren(children: React.ReactNode): React.ReactElement[] {
  return React.Children.toArray(children).filter((child) => React.isValidElement(child)) as React.ReactElement[]
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ children, max, size, ...props }) => {
  const validChildren = getValidChildren(children)
  const displayChildren = max ? validChildren.slice(0, max) : validChildren
  const remainingChildrenCount = validChildren.length - (max || 0)
  const reversedChildren = displayChildren.reverse()

  const childProps = {
    size,
    border: '2px solid white',
  }

  const clones = reversedChildren.map((child, index) => {
    const isFirstAvatar = index === 0

    return React.cloneElement(child, {
      marginRight: isFirstAvatar && !remainingChildrenCount ? 0 : -9,
      ...childProps,
    })
  })

  return (
    <Pane role="group" display="flex" flexDirection="row-reverse" alignItems="center" {...props}>
      {remainingChildrenCount > 0 && <Avatar {...childProps}>{`+${remainingChildrenCount}`}</Avatar>}
      {clones}
    </Pane>
  )
}
