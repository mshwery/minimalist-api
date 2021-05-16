import React from 'react'
import { Redirect } from 'react-router-dom'
import { useCurrentUser } from '../components/UserContext'
import Login from '../components/Login'
import { RouteComponentProps } from 'react-router'

const LoginWrapper: React.FunctionComponent<RouteComponentProps> = (props) => {
  const context = useCurrentUser()

  if (context.user) {
    return (
      <Redirect
        to={{
          pathname: '/lists/inbox',
          state: {
            from: props.location,
          },
        }}
      />
    )
  }

  return <Login googleAuthUrl="/connect/google" />
}

export default LoginWrapper
