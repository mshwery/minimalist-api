/**
 * @overview higher order component to wrap components with a `user` and `refreshUser` prop
 */

import React from 'react'
import getDisplayName from '../../lib/get-display-name'
import { Difference } from '../../@types/type-helpers'
import { Consumer, Context } from './context'

export default function withUserContext<P extends Context>(Component: React.ComponentType<P>) {
  return class WithUserContext extends React.Component<Difference<P, Context>> {
    static displayName = `WithUserContext(${getDisplayName(Component)})`

    render() {
      return (
        <Consumer>
          {({ refetchUser, user }) => (
            <Component refetchUser={refetchUser} user={user} {...this.props as P} />
          )}
        </Consumer>
      )
    }
  }
}
