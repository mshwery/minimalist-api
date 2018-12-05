/**
 * @overview authentication / encryption utils
 */

import bcrypt from 'bcrypt'
import expressJwt from 'express-jwt'
import jwt from 'jsonwebtoken'
import { defaults } from 'lodash'
import config from '../../config'
import logger from './logger'

const secret = config.get('JWT_SECRET')
const defaultOptions = {
  expiresIn: '1hr',
  issuer: 'minimalist-api'
}

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

/**
 * Generates a JWT
 * @see {@link https://github.com/auth0/node-jsonwebtoken#usage}
 */
export function generateJwt(payload: string | Buffer | object, options: jwt.SignOptions = defaultOptions): string {
  options = defaults(options, defaultOptions)
  const token = jwt.sign(payload, secret, options)
  return token
}

export const verifyJwt = expressJwt({
  secret,
  issuer: defaultOptions.issuer,
  /** this option allows us to handle 401s manually, so we can more granularly handle public vs private queries in graphql */
  credentialsRequired: false
})
