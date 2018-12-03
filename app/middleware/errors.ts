/**
 * @overview Error helpers
 */

import { Request, Response, NextFunction } from 'express'
import { NotFound } from 'http-errors'
import logger from '../lib/logger'

interface IError extends Error {
  status?: number
}

/**
 * Middleware to handle response for errors
 */
export function handleErrorResponse(error: IError, _req: Request, res: Response, _next: NextFunction) {
  const message = error.message || 'Server Error'
  const status = error.status || 500
  const plainText = [message, error].join('\n')

  logger.error(error)

  res.status(status).format({
    text() {
      res.send(plainText)
    },

    html() {
      res.send(plainText)
    },

    json() {
      res.send({ message, error })
    }
  })
}

/**
 * Handler for missing routes
 */
export function handleNotFound(_req: Request, _res: Response, next: NextFunction) {
  next(new NotFound())
}
