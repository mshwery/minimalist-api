import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { withUserContext } from '../UserContext'
import { Context } from '../UserContext/context'

const PrivateRoute: React.FunctionComponent<RouteProps & Context> = ({
  component: Component,
  user,
  refetchUser,
  ...routeProps
}) => {
  if (!Component) {
    return null
  }

  const userContext = { user, refetchUser }

  return (
    <Route {...routeProps} render={(props) => user
      ? <Component {...userContext} {...props} />
      : <Redirect to={{
            pathname: '/login',
            state: {
              from: props.location
            }
          }}
        />
    } />
  )
}

export default withUserContext(PrivateRoute)
