import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { useCurrentUser } from '../UserContext'

export const PrivateRoute: React.FunctionComponent<RouteProps> = ({ component: Component, ...routeProps }) => {
  const context = useCurrentUser()

  if (!Component) {
    return null
  }

  return (
    <Route
      {...routeProps}
      render={props =>
        context.user ? (
          <Component {...context} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {
                from: props.location
              }
            }}
          />
        )
      }
    />
  )
}
