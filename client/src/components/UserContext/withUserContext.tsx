/**
 * @overview higher order component to wrap components with a `user` and `refreshUser` prop
 */

import React from 'react'
import getDisplayName from '../../lib/get-display-name'
import { Consumer, Context } from './context'

type Difference<A, B> = Pick<A, Exclude<keyof A, keyof B>>

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
