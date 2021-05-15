import React from 'react'
import { RouteComponentProps } from 'react-router'
import { scale, Avatar, Button, Pane, Link, Text, Heading, Paragraph } from '../base-ui'
import { ReactComponent as Logo } from '../minimalist.svg'

const Wrap: React.FunctionComponent<{}> = ({ children }) => {
  return (
    <Pane width="100%" maxWidth={1200} paddingX={scale(6)} marginX="auto">
      {children}
    </Pane>
  )
}

const TopBar: React.FunctionComponent<{}> = () => {
  return (
    <Pane is="header" paddingY={scale(6)}>
      <Wrap>
        <Pane display="flex" justifyContent="space-between" alignItems="center">
          <Logo />
          <Text display="inline-flex" alignItems="center" fontWeight={500}>
            Made with ♥ by
            <Avatar
              size={scale(3)}
              src="https://www.gravatar.com/avatar/35a56e667f5e7513ad75278649b0ac2a"
              marginX={scale(1)}
            />
            <Link href="https://www.mattshwery.com" target="_blank">
              Matt Shwery
            </Link>
          </Text>
        </Pane>
      </Wrap>
    </Pane>
  )
}

const Hero: React.FunctionComponent<{}> = () => {
  const [isLoading, setIsLoading] = React.useState(false)

  return (
    <Pane is="section" paddingY={scale(6)}>
      <Wrap>
        <Heading is="h1" fontSize={scale(8)} fontWeight={700} textAlign="center">
          Simple, shareable todo lists.
        </Heading>
        <Paragraph fontSize={scale(3)} textAlign="center" marginY={scale(3)}>
          The easiest way to keep track of the stuff you want to do.
        </Paragraph>
        <Pane display="flex" justifyContent="center">
          <Button
            is="a"
            href={`/connect/google?redirect=${encodeURIComponent('/lists')}`}
            width={scale(38)}
            size="large"
            maxWidth="100%"
            marginY={scale(2)}
            onClick={() => setIsLoading(true)}
            isLoading={isLoading}
          >
            Sign in with Google
          </Button>
        </Pane>
      </Wrap>
    </Pane>
  )
}

const LandingPage: React.FunctionComponent<RouteComponentProps> = () => {
  return (
    <>
      <TopBar />
      <Hero />
    </>
  )
}

export default LandingPage
