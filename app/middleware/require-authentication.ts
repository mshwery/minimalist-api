import { Request, Response, NextFunction } from 'express'
import { Unauthorized } from 'http-errors'

/**
 * Middleware that checks for the existence of a user property on the request (which is set elsewhere by token validation middleware)
 * If no user is attached to the request, throw a 401 Unauthorized
 */
export default function requireAuthentication(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    next(new Unauthorized())
  }

  next()
}
