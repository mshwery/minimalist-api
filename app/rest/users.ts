/**
 * @overview user route handlers
 */

import { NotFound, Unauthorized } from 'http-errors'
import { get } from 'lodash'
import { comparePassword, generateJwt } from '../lib/auth'
import { UserModel } from '../models/user'

export async function me(req, res, next) {
  try {
    const viewer = req.user.sub
    const user = await UserModel.fetchByViewer(viewer)

    if (!user) {
      throw new NotFound(`No user found with id: "${viewer}"`)
    }

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export async function createUser(req, res, next) {
  try {
    const viewer = get(req, 'user.sub')
    const { email, password } = req.body
    const user = await UserModel.create(viewer, { email, password })
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export async function deleteUser(req, res, next) {
  try {
    await UserModel.delete(req.user.sub, req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function authenticate(req, res, next) {
  try {
    const viewer = get(req, 'user.sub')
    const { email, password } = req.body
    const user = await UserModel.fetchByEmail(viewer, email)

    if (!user) {
      throw new NotFound(`No user found with email address: "${email}"`)
    }

    const isMatch = await comparePassword(password, user.password)

    if (!isMatch) {
      throw new Unauthorized(`We didn't recognize that combination of email and password.`)
    }

    const token = generateJwt({ sub: user.id })
    res.status(200).json({ token })
  } catch (error) {
    next(error)
  }
}
