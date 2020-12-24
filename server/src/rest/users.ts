/**
 * @overview user route handlers
 */

import { addHours } from 'date-fns'
import { Response, Request, NextFunction } from 'express'
import { NotFound } from 'http-errors'
import { get } from 'lodash'
import { UserModel } from '../models/user'
import config from '../../config'
import { SESSION_COOKIE } from '../lib/auth'

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const viewer = get(req, 'user.sub')
    const user = await UserModel.fetchByViewer(viewer)

    if (!user) {
      throw new NotFound(`No user found with id: "${viewer}"`)
    }

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const viewer = get(req, 'user.sub')
    const { email, password } = req.body
    const user = await UserModel.create(viewer, { email, password })
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body
    const expires = addHours(new Date(), 24)
    const result = await UserModel.authenticate({ email, password })

    // Persist token in an HTTP-only cookie
    res.cookie(SESSION_COOKIE, result.token, {
      httpOnly: true,
      secure: config.get('ENV') === 'production',
      // TODO: set `domain = '.getminimalist.com'`
      expires,
    })

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
