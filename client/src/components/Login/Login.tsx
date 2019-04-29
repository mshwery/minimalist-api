import React, { Component } from 'react'
import { scale, Button, Card, Heading, Link, Pane, Paragraph } from '../../base-ui'

interface LoginProps {
  googleAuthUrl: string
  facebookAuthUrl?: string
}

class Login extends Component<LoginProps> {
  render() {
    return (
      <Card
        elevation={1}
        maxWidth='100%'
        width={scale(100)}
        justifyContent='center'
        margin='auto'
        padding={scale(5)}
      >
        <Heading size={700}>Welcome back.</Heading>
        <Paragraph>Sign in to manage your lists.</Paragraph>
        <Button is='a' href={this.props.googleAuthUrl}>Sign in with Google</Button>
        <Pane>
          No account? <Link href='/create'>Create one</Link>
        </Pane>
      </Card>
    )
  }
}

export default Login
