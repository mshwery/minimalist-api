import React, { useState } from 'react'
import { css } from 'emotion'
import { scale, Button, Card, Paragraph, Pane, colors } from '../../base-ui'
import { ReactComponent as Logo } from '../../minimalist.svg'

interface LoginProps {
  googleAuthUrl: string
}

export const Login: React.FunctionComponent<LoginProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Pane
      height="100vh"
      width="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor={colors.fill.background}
    >
      <Card
        elevation={2}
        maxWidth={scale(100)}
        width="90%"
        textAlign="center"
        paddingY={scale(10)}
        paddingX={scale(5)}
        display="flex"
        flexDirection="column"
        alignItems="center"
        className={css`
          justify-content: center;

          @media (max-width: 600px) {
            width: 100vw;
            height: 100vh;
            justify-content: flex-start;
          }
        `}
      >
        <Logo />
        <Paragraph maxWidth={scale(38)} marginY={scale(2)} marginX="auto">
          The simplest way to keep track of the stuff you want to do.
        </Paragraph>
        <Button
          is="a"
          href={props.googleAuthUrl}
          variant="minimal"
          width={scale(38)}
          maxWidth="100%"
          lineHeight="2.5"
          marginY={scale(2)}
          onClick={() => setIsLoading(true)}
          isLoading={isLoading}
        >
          Sign in with Google
        </Button>
        {/* TODO: support email/pass logins (w/ email verification) */}
        {/* <Pane>
          Don't have an account? <Link href='/create'>Create one</Link>
        </Pane> */}
      </Card>
    </Pane>
  )
}
