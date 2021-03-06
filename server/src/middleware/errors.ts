import { Request, Response, NextFunction } from 'express'
import logger from '../lib/logger'
import config from '../../config'

interface HttpError extends Error {
  status?: number
  expose?: boolean
}

/**
 * Middleware to handle response for errors
 */
export default function handleErrorResponse(error: HttpError, _req: Request, res: Response, _next: NextFunction): void {
  const status = error.status || 500
  let message = 'Server Error'

  if (error.expose || config.get('NODE_ENV') !== 'production') {
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
        id: res.sentry,
      })
    },
  })
}
