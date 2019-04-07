import { Request, Response, NextFunction } from 'express'
import logger from '../lib/logger'

interface HttpError extends Error {
  status?: number
  expose?: boolean
}

/**
 * Middleware to handle response for errors
 */
export default function handleErrorResponse(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
  const status = error.status || 500
  let message = 'Server Error'

  if (error.expose) {
    message = error.message
  }

  logger.error(error)

  res.status(status).format({
    text() {
      res.send(message)
    },

    html() {
      res.send(message)
    },

    json() {
      res.send({
        error: message,
        id: res.sentry
      })
    }
  })
}
