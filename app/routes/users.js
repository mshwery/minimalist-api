/**
 * @overview user route handlers
 */

const { NotFound, Unauthorized } = require('http-errors')
const { User } = require('../database')
const { comparePassword, generateJwt } = require('../lib/auth')
const withValidation = require('../middleware/validation')
const schema = require('../schema/user')

const INVALID_CREDS_MESSAGE = 'We didn\'t recognize that combination of email and password.'

function userNotFound (id) {
  return new NotFound(`No user found with id: '${id}'`)
}

exports.getUser = async function getUser (req, res, next) {
  const id = req.params.id
  const user = await User.get(id)

  if (!user) {
    throw userNotFound(id)
  }

  res.status(200).json(user)
}

exports.createUser = withValidation({ body: schema },
  async function createUser (req, res, next) {
    const user = await User.create(req.body)
    res.status(201).json(user)
  }
)

exports.deleteUser = async function deleteUser (req, res, next) {
  const id = req.params.id
  const user = await User.destroy(id)

  if (!user) {
    throw userNotFound(id)
  }

  res.status(204).end()
}

exports.authenticate = async function authenticate (req, res, next) {
  const { email, password } = req.body
  const user = await User.findByEmail(email)

  if (!user) {
    throw new Unauthorized(INVALID_CREDS_MESSAGE)
  }

  const isMatch = await comparePassword(password, user.password)

  if (!isMatch) {
    throw new Unauthorized(INVALID_CREDS_MESSAGE)
  }

  const token = generateJwt({ sub: user.user_id })
  res.status(200).json({ token })
}
