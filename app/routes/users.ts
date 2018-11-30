/**
 * @overview user route handlers
 */

import { Forbidden, NotFound, Unauthorized } from 'http-errors'
import { comparePassword, generateJwt } from '../lib/auth'
import { getRepository } from 'typeorm'
import { User } from '../models/user.entity'

const INVALID_CREDS_MESSAGE = "We didn't recognize that combination of email and password."

function userNotFound(id) {
  return new NotFound(`No user found with id: '${id}'`)
}

export async function me(req, res, next) {
  try {
    const id = req.user.sub
    const user = await getRepository(User).findOne(id)

    if (!user) {
      throw userNotFound(id)
    }

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export async function getUser(req, res, next) {
  try {
    const id = req.params.id

    // only allow users to get self
    if (id !== req.user.sub) {
      throw new Forbidden()
    }

    const user = await getRepository(User).findOne(id)

    if (!user) {
      throw userNotFound(id)
    }

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export async function createUser(req, res, next) {
  try {
    const { email, password } = req.body
    const repo = getRepository(User)

    const user = repo.create({ email, password })
    await repo.save(user)

    res.status(201).json(user)
  } catch (error) {
    // TODO handle dupe email
    next(error)
  }
}

export async function deleteUser(req, res, next) {
  try {
    const id = req.params.id

    // only allow users to delete self
    if (id !== req.user) {
      throw new Forbidden()
    }

    const { affected } = await getRepository(User).delete(id)
    if (!affected) {
      throw userNotFound(id)
    }

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function authenticate(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await getRepository(User).findOne({ email })

    if (!user) {
      throw new Unauthorized(INVALID_CREDS_MESSAGE)
    }

    const isMatch = await comparePassword(password, user.password)

    if (!isMatch) {
      throw new Unauthorized(INVALID_CREDS_MESSAGE)
    }

    const token = generateJwt({ sub: user.id })
    res.status(200).json({ token })
  } catch (error) {
    next(error)
  }
}
