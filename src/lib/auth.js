/**
 * @overview authentication / encryption utils
 */

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const defaults = require('lodash/defaults')
const config = require('../../config')

const secret = config.get('JWT_SECRET')
const defaultOptions = {
  expiresIn: '1hr',
  issuer: 'minimalist-api'
}

async function comparePassword (password, hash) {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    // @todo log
    return false
  }
}

async function hashPassword (password) {
  const hash = await bcrypt.hash(password, 10)
  return hash
}

/**
 * Generates a JWT
 * @see {@link https://github.com/auth0/node-jsonwebtoken#usage}
 */
function generateJwt (payload, options = defaultOptions) {
  options = defaults(options, defaultOptions)
  const token = jwt.sign(payload, secret, options)
  return token
}

const verifyJwt = expressJwt({
  secret,
  issuer: defaultOptions.issuer
})

module.exports = {
  comparePassword,
  hashPassword,
  generateJwt,
  verifyJwt
}
