import React from 'react'
import { scale, Avatar, Pane, Text } from '../../base-ui'

interface UserMenuProps {
  email: string
  image: string
  name?: string
  marginBottom?: number
}

export default class UserMenu extends React.PureComponent<UserMenuProps> {
  render() {
    const { email = '', image = '', name = '', marginBottom } = this.props

    return (
      <Pane display='flex' alignItems='center' marginBottom={marginBottom}>
        {image && <Avatar src={image} size={scale(5)} marginRight={scale(2)} />}
        <Pane flex='1' display='flex' flexDirection='column'>
          <Text fontWeight={500} marginY={scale(0.5)}>{name}</Text>
          <Text size={300} color='muted'>{email}</Text>
        </Pane>
      </Pane>
    )
  }
}
