import React from 'react'
import { RouteComponentProps } from 'react-router'
import { css } from '@emotion/css'
import { scale, Avatar, Button, Pane, Link, Text, Heading, Paragraph } from '../base-ui'
import { ReactComponent as Logo } from '../minimalist.svg'
import browserScreenshot from '../minimalist-screenshot.png'

const Wrap: React.FunctionComponent = ({ children }) => {
  return (
    <Pane width="100%" maxWidth={1200} paddingX={scale(6)} marginX="auto">
      {children}
    </Pane>
  )
}

const TopBar: React.FunctionComponent = () => {
  return (
    <Pane is="header" paddingY={scale(6)}>
      <Wrap>
        <Pane
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          className={css`
            @media (max-width: 600px) {
              justify-content: center;
            }
          `}
        >
          <Logo />
          <Text
            display="inline-flex"
            alignItems="center"
            fontWeight={500}
            marginY={scale(1)}
            className={css`
              @media (max-width: 600px) {
                flex-basis: 100%;
                justify-content: center;
              }
            `}
          >
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
    <Pane is="section" paddingTop={scale(6)}>
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
        <Pane>
          <img width="100%" src={browserScreenshot} />
        </Pane>
      </Wrap>
    </Pane>
  )
}

const Feature: React.FunctionComponent<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <Pane>
      <Heading size={400}>{title}</Heading>
      <Paragraph marginY={scale(1)}>{description}</Paragraph>
    </Pane>
  )
}

const Features: React.FunctionComponent = () => {
  return (
    <Pane is="section" paddingTop={scale(6)} paddingBottom={scale(12)}>
      <Wrap>
        <Pane
          display="grid"
          gridColumnGap={scale(10)}
          gridRowGap={scale(6)}
          gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        >
          <Feature
            title="Minimal and bloat-free"
            description="Beautifully simple, with all the basic features you expect. No bloat-ware here."
          />
          <Feature
            title="With you everywhere"
            description="Your lists are available anywhere you are. Easily access them from your phone, tablet, or laptop."
          />
          <Feature
            title="Work better together"
            description="Invite others to your lists to help get things done – because some lists are better shared (and some are not)."
          />
        </Pane>
      </Wrap>
    </Pane>
  )
}

const Footer: React.FunctionComponent = () => {
  return (
    <Wrap>
      <Pane textAlign="center" paddingY={scale(2)}>
        <Text>© 2012-{new Date().getFullYear()} Matt Shwery</Text>
      </Pane>
    </Wrap>
  )
}

const LandingPage: React.FunctionComponent<RouteComponentProps> = () => {
  return (
    <>
      <TopBar />
      <Hero />
      <Features />
      <Footer />
    </>
  )
}

export default LandingPage
