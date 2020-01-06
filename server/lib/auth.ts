/**
 * @overview authentication / encryption utils
 */

import bcrypt from 'bcrypt'
import express from 'express'
import expressJwt from 'express-jwt'
import jwt from 'jsonwebtoken'
import { defaults } from 'lodash'
import config from '../../config'
import logger from './logger'

const secret = config.get('JWT_SECRET')
const defaultOptions = {
  expiresIn: '7 days',
  issuer: 'minimalist-api'
}

export const SESSION_COOKIE = 'session_token'

export async function comparePassword(password, hash): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    logger.error(error)
    return false
  }
}

export function hashPassword(password): Promise<string> {
  return bcrypt.hash(password, 10)
}

interface JwtPayload {
  sub?: string
}

/**
 * Generates a JWT
 * @see {@link https://github.com/auth0/node-jsonwebtoken#usage}
 */
export function generateJwt(
  payload: string | Buffer | object | JwtPayload,
  options: jwt.SignOptions = defaultOptions
): string {
  options = defaults(options, defaultOptions)
  const token = jwt.sign(payload, secret, options)
  return token
}

export function verifyJwt(token: string) {
  const decoded = jwt.verify(token, secret)
  return decoded
}

export const verifyJwtMiddleware = expressJwt({
  secret,
  issuer: defaultOptions.issuer,
  // avoid clashing with passport `req.user`
  requestProperty: 'jwt',
  // manually decide when to throw 401s
  credentialsRequired: false,
  getToken(req: express.Request) {
    if (req.headers.authorization) {
      return getTokenFromHeader(req.headers.authorization)
    } else if (req.cookies[SESSION_COOKIE]) {
      return req.cookies[SESSION_COOKIE]
    }

    return null
  }
})

function getTokenFromHeader(authorization: string): string | null {
  const [scheme, token = null] = authorization.split(' ')

  if (/^Bearer$/i.test(scheme)) {
    return token
  }

  return null
}
