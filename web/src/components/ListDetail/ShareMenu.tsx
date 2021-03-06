import React, { useState, useRef } from 'react'
import { UserPlus, X as RemoveIcon, LogOut } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import { useHistory } from 'react-router'
import {
  AvatarGroup,
  scale,
  Dialog,
  Button,
  Pane,
  Heading,
  Input,
  Icon,
  colors,
  Paragraph,
  Avatar,
  Text,
} from '../../base-ui'
import { useAddCollaborator, useRemoveCollaborator, useCollaborators } from './queries'
import { useCurrentUser } from '../UserContext'

const MAX_AVATARS_SHOWN = 4

const Names: React.FC<{ primary: string; secondary?: string; isOwner: boolean }> = ({
  primary,
  secondary,
  isOwner,
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = userContext.user!
  const isCurrentUserOwner = currentUser.id === creator

  const { collaborators, isLoading } = useCollaborators(listId)
  const addCollaborator = useAddCollaborator(listId)
  const removeCollaborator = useRemoveCollaborator(listId, isCurrentUserOwner)

  if (listId === 'inbox' || listId === 'upcoming') {
    return null
  }

  return (
    <>
      <Pane display="flex" alignItems="center">
        {!isTabletOrMobile && Array.isArray(collaborators) && (
          <AvatarGroup
            size={scale(4) + 4}
            max={MAX_AVATARS_SHOWN}
            cursor="pointer"
            marginX={scale(1)}
            onClick={() => setIsDialogShown(true)}
          >
            {collaborators.map((user) => (
              <Avatar key={user.id} title={user.name || user.email} src={user.image} />
            ))}
          </AvatarGroup>
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
          onSubmit={async (event) => {
            event.preventDefault()

            if (!emailRef.current) {
              return
            }

            const email = emailRef.current.value.trim()
            await addCollaborator.mutateAsync({ id: listId, email })

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
              disabled={addCollaborator.isLoading}
            />
          </Pane>
          <Pane marginTop={scale(2)}>
            {Array.isArray(collaborators) &&
              collaborators.map((user) => (
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
                      disabled={removeCollaborator.isLoading}
                      icon={user.email === currentUser.email ? LogOut : RemoveIcon}
                      color={colors.fill.secondary}
                      size={scale(2)}
                      title={user.email === currentUser.email ? 'Leave this list' : 'Unshare'}
                      onClick={async () => {
                        if (removeCollaborator.isLoading) {
                          return
                        }
                        await removeCollaborator.mutateAsync({ id: listId, email: user.email })
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
            <Button
              isLoading={isLoading || addCollaborator.isLoading}
              onClick={() => setIsDialogShown(false)}
              variant="minimal"
            >
              Done
            </Button>
          </Pane>
        </form>
      </Dialog>
    </>
  )
}
