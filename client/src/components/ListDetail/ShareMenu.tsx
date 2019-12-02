import React, { useState, useRef } from 'react'
import { UserPlus, X as RemoveIcon } from 'react-feather'
import { useMutation, useQuery } from 'react-query'
import ms from 'ms'
import { scale, Dialog, Button, Pane, Heading, Input, Icon, colors, Paragraph, Avatar, Text } from '../../base-ui'
import { shareList, unshareList, getCollaborators } from './queries'

const Names: React.FC<{ primary: string, secondary?: string, isOwner: boolean }> = ({ primary, secondary, isOwner }) => {
  return (
    <>
      <Text size={300}>{primary}{isOwner && ' (owner)'}</Text>
      {secondary && <Text size={200} color='muted' marginTop={scale(0.5)}>{secondary}</Text>}
    </>
  )
}

interface Props {
  listId: string
}

export const ShareMenu: React.FunctionComponent<Props> = ({ listId }) => {
  const [isDialogShown, setIsDialogShown] = useState(false)
  const emailRef = useRef<HTMLInputElement>()

  const { data: collaborators, isLoading } = useQuery(['collaborators', { id: listId }], getCollaborators, {
    staleTime: ms('1m')
  })
  const [addCollaborator, { isLoading: isUpdating }] = useMutation(shareList, {
    refetchQueries: [['collaborators', { id: listId }]]
  })
  const [removeCollaborator, { isLoading: isRemoving }] = useMutation(unshareList, {
    refetchQueries: [['collaborators', { id: listId }]]
  })

  if (listId === 'inbox') {
    return null
  }

  return (
    <>
      <Icon
        icon={UserPlus}
        size={scale(2.5)}
        color={colors.fill.secondary}
        marginRight={scale(1)}
        onClick={() => setIsDialogShown(true)}
      />
      <Dialog isShown={isDialogShown} requestClose={() => setIsDialogShown(false)} width={scale(60)}>
        <form onSubmit={async (event) => {
          event.preventDefault()

          if (!emailRef.current) {
            return
          }

          const email = emailRef.current.value.trim()
          await addCollaborator({ id: listId, email })

          // Reset input
          emailRef.current.value = ''
        }}>
          <Heading size={300}>Share list</Heading>
          <Pane marginTop={scale(2)}>
            <Paragraph marginY={scale(2)} size={300} color='muted'>
              You can share this list with others by inviting them via their email addresses. Anyone you share it with will be able to collaborate on tasks in this list.
            </Paragraph>
            <Input
              autoFocus
              placeholder='Enter an email address and press enter to send an invite'
              innerRef={emailRef}
              type='email'
              width='100%'
              disabled={isUpdating}
            />
          </Pane>
          <Pane marginTop={scale(2)}>
            {Array.isArray(collaborators) && collaborators.map(user => (
              <Pane
                key={user.id}
                display='flex'
                alignItems='center'
                paddingY={scale(1)}
              >
                <Avatar src={user.image} size={scale(5)} marginRight={scale(1.5)} />
                <Pane flex='1' display='flex' flexDirection='column'>
                  {user.name
                    ? <Names primary={user.name} secondary={user.email} isOwner={user.isOwner} />
                    : <Names primary={user.email} isOwner={user.isOwner} />
                  }
                </Pane>
                {!user.isOwner && (
                  <Icon
                    disabled={isRemoving}
                    icon={RemoveIcon}
                    color={colors.fill.secondary}
                    size={scale(2)}
                    onClick={() => {
                      if (isRemoving) {
                        return
                      }
                      void removeCollaborator({ id: listId, email: user.email })
                    }}
                  />
                )}
              </Pane>
            ))}
          </Pane>
          <Pane display='flex' justifyContent='flex-end' alignItems='center' marginTop={scale(4)}>
            <Button isLoading={isLoading || isUpdating} onClick={() => setIsDialogShown(false)} variant='minimal'>Done</Button>
          </Pane>
        </form>
      </Dialog>
    </>
  )
}
