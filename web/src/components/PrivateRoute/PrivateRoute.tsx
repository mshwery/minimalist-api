import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { useMountedState } from 'react-use'
import { useCurrentUser } from '../UserContext'
import Login from '../Login'

export const PrivateRoute: React.FunctionComponent<RouteProps> = ({ component: Component, ...routeProps }) => {
  const context = useCurrentUser()
  const isMounted = useMountedState()

  if (!Component) {
    return null
  }

  return (
    <Route
      {...routeProps}
      render={(props) =>
        context.user ? (
          <Component {...context} {...props} />
        ) : isMounted() ? (
          <Login googleAuthUrl={`/connect/google?redirect=${encodeURIComponent(window.location.pathname)}`} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {
                from: props.location,
              },
            }}
          />
        )
      }
    />
  )
}
