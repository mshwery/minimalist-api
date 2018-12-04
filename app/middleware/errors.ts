/**
 * @overview Error helpers
 */

import { Request, Response, NextFunction } from 'express'
import { NotFound } from 'http-errors'
import logger from '../lib/logger'

interface IError extends Error {
  status?: number
  expose?: boolean
}

/**
 * Middleware to handle response for errors
 */
export function handleErrorResponse(error: IError, _req: Request, res: Response, _next: NextFunction) {
  const status = error.status || 500
  let message = 'Server Error'

  if (typeof error.expose !== 'boolean' || error.expose) {
    message = message
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
      res.send({ error: message })
    }
  })
}

/**
 * Handler for missing routes
 */
export function handleNotFound(_req: Request, _res: Response, next: NextFunction) {
  next(new NotFound())
}
