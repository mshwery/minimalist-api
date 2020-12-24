import { Request, Response, NextFunction } from 'express'
import { NotFound } from 'http-errors'

/**
 * Handler for missing routes
 */
export default function handleNotFound(_req: Request, _res: Response, next: NextFunction): void {
  next(new NotFound())
}
