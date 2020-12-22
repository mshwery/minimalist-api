import React, { useState, useRef } from 'react'
import { UserPlus, X as RemoveIcon, LogOut } from 'react-feather'
import { useMutation, useQuery } from 'react-query'
import { useMediaQuery } from 'react-responsive'
import { useHistory } from 'react-router'
import { scale, Dialog, Button, Pane, Heading, Input, Icon, colors, Paragraph, Avatar, Text } from '../../base-ui'
import { shareList, unshareList, getCollaborators } from './queries'
import { useCurrentUser } from '../UserContext'

const MAX_AVATARS_SHOWN = 4

const Names: React.FC<{ primary: string; secondary?: string; isOwner: boolean }> = ({
  primary,
  secondary,
  isOwner
}) => {
  return (
    <>
      <Text size={300}>
        {primary}
        {isOwner && ' (owner)'}
      </Text>
      {secondary && (
        <Text size={200} color="muted" marginTop={scale(0.5)} overflow="hidden" textOverflow="ellipsis">
          {secondary}
        </Text>
      )}
    </>
  )
}

interface Props {
  listId: string
  creator?: string
}

export const ShareMenu: React.FunctionComponent<Props> = ({ listId, creator }) => {
  const [isDialogShown, setIsDialogShown] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const history = useHistory()
  const userContext = useCurrentUser()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const currentUser = userContext.user!
  const isCurrentUserOwner = currentUser.id === creator

  const { data: collaborators, isLoading } = useQuery(['collaborators', { id: listId }], getCollaborators)
  const [addCollaborator, { isLoading: isUpdating }] = useMutation(shareList, {
    refetchQueries: [['collaborators', { id: listId }]]
  })

  const refetchQueries: Array<string | [string, any]> = [['collaborators', { id: listId }]]
  // Non-owners will only be "leaving" lists, so we should refetch the lists they have access to after leaving
  if (!isCurrentUserOwner) {
    refetchQueries.push('lists')
  }
  const [removeCollaborator, { isLoading: isRemoving }] = useMutation(unshareList, { refetchQueries })

  if (listId === 'inbox') {
    return null
  }

  const collaboratorCount = Array.isArray(collaborators) ? collaborators.length : 0
  const overflowCount = Math.max(0, collaboratorCount - MAX_AVATARS_SHOWN)

  return (
    <>
      <Pane display="flex" alignItems="center">
        {!isTabletOrMobile && (
          <Pane display="flex" flexDirection="row-reverse" alignItems="center" onClick={() => setIsDialogShown(true)}>
            {overflowCount > 0 && (
              <Pane
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="50%"
                width={scale(4)}
                height={scale(4)}
                backgroundColor={colors.fill.secondary}
                color="white"
              >
                <Text size={300}>{overflowCount}</Text>
              </Pane>
            )}
            {Array.isArray(collaborators) &&
              collaborators
                .slice(0, MAX_AVATARS_SHOWN)
                .reverse()
                .map((user, index) => (
                  <Avatar
                    key={user.id}
                    title={user.name || user.email}
                    cursor="pointer"
                    src={user.image}
                    size={scale(4) + 4}
                    marginRight={index || overflowCount ? -9 : undefined}
                    border={`2px solid white`}
                  />
                ))}
          </Pane>
        )}
        <Icon
          icon={UserPlus}
          size={scale(2.5)}
          color={colors.fill.secondary}
          marginX={scale(1.5)}
          onClick={() => setIsDialogShown(true)}
        />
      </Pane>
      <Dialog isShown={isDialogShown} requestClose={() => setIsDialogShown(false)} width={scale(60)}>
        <form
          onSubmit={async event => {
            event.preventDefault()

            if (!emailRef.current) {
              return
            }

            const email = emailRef.current.value.trim()
            await addCollaborator({ id: listId, email })

            // Reset input
            emailRef.current.value = ''
          }}
        >
          <Heading size={300}>Share list</Heading>
          <Pane marginTop={scale(2)}>
            <Paragraph marginY={scale(2)} size={300} color="muted">
              You can share this list with others by inviting them via their email addresses. Anyone you share it with
              will be able to collaborate on tasks in this list.
            </Paragraph>
            <Input
              autoFocus
              placeholder="Enter an email address and press enter to send an invite"
              ref={emailRef}
              type="email"
              width="100%"
              disabled={isUpdating}
            />
          </Pane>
          <Pane marginTop={scale(2)}>
            {Array.isArray(collaborators) &&
              collaborators.map(user => (
                <Pane key={user.id} display="flex" alignItems="center" paddingY={scale(1)}>
                  <Avatar src={user.image} size={scale(5)} marginRight={scale(1.5)} />
                  <Pane flex="1" display="flex" flexDirection="column" overflow="hidden" marginRight={scale(1)}>
                    {user.name ? (
                      <Names primary={user.name} secondary={user.email} isOwner={user.isOwner} />
                    ) : (
                      <Names primary={user.email} isOwner={user.isOwner} />
                    )}
                  </Pane>
                  {!user.isOwner && (isCurrentUserOwner || user.email === currentUser.email) && (
                    <Icon
                      disabled={isRemoving}
                      icon={user.email === currentUser.email ? LogOut : RemoveIcon}
                      color={colors.fill.secondary}
                      size={scale(2)}
                      title={user.email === currentUser.email ? 'Leave this list' : 'Unshare'}
                      onClick={async () => {
                        if (isRemoving) {
                          return
                        }
                        await removeCollaborator({ id: listId, email: user.email })
                        if (user.email === currentUser.email) {
                          setIsDialogShown(false)
                          history.push('/lists/inbox')
                        }
                      }}
                    />
                  )}
                </Pane>
              ))}
          </Pane>
          <Pane display="flex" justifyContent="flex-end" alignItems="center" marginTop={scale(4)}>
            <Button isLoading={isLoading || isUpdating} onClick={() => setIsDialogShown(false)} variant="minimal">
              Done
            </Button>
          </Pane>
        </form>
      </Dialog>
    </>
  )
}
