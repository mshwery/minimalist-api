import React, { Component } from 'react'
import { Button, Card, Heading, Link, Pane, Paragraph, majorScale } from 'evergreen-ui'

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
        width={majorScale(100)}
        justifyContent='center'
        margin='auto'
        padding={majorScale(5)}
        background='white'
      >
        <Heading is='h1' size={800}>Welcome back.</Heading>
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
