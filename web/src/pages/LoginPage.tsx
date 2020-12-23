import React from 'react'
import Login from '../components/Login'
import { RouteComponentProps } from 'react-router'

const LoginWrapper: React.FunctionComponent<RouteComponentProps<{}, {}>> = () => {
  return <Login googleAuthUrl="/connect/google" />
}

export default LoginWrapper
