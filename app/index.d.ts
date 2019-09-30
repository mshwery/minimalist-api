declare namespace Express {
  interface Response {
    sentry: string
  }

  interface User {
    id: string
  }

  interface Request {
    jwt?: {
      // The jwt "subject" (aka user id)
      sub: string
    }
  }
}
