declare namespace Express {
  interface Response {
    sentry: string
  }

  interface Request {
    // The currently authenticated user object
    user?: {
      // The jwt "subject" (aka user id)
      sub: string
    }
  }
}
