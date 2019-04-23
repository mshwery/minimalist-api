import { Conflict, Forbidden, NotFound, Unauthorized } from 'http-errors'
import { getCustomRepository } from 'typeorm'
import { comparePassword, generateJwt } from '../../lib/auth'
import { Viewer, UUID } from '../../types'
import User from './user.entity'
import UserRepository from './user.repository'

export { User, UserRepository }

export function canEditUser(viewer: Viewer, user: { id: string }): boolean {
  if (!viewer) {
    return false
  }

  // for now, only allow users to edit their own account
  if (user.id === viewer) {
    return true
  }

  return false
}

export class UserModel {
  /**
   * Gets the user associated with the viewer
   */
  static async fetchByViewer(viewer: Viewer): Promise<User | null> {
    if (!viewer) {
      return null
    }

    const user = await getCustomRepository(UserRepository).findOne({ id: viewer })
    return user || null
  }

  /**
   * Gets or creates a user by email + googleId
   */
  static async findOrCreateByEmailAndGoogleId(email: string, googleId: string) {
    return getCustomRepository(UserRepository).findOrCreate({
      email,
      googleId
    })
  }

  /**
   * Creates a user given some attributes
   */
  static async create(_viewer: Viewer, attrs: { id?: UUID; email: string; password: string }): Promise<User> {
    const repo = getCustomRepository(UserRepository)

    if (await repo.findByEmail(attrs.email)) {
      throw new Conflict('A user with this email address already exists.')
    }

    const user = repo.create(attrs)
    return repo.save(user)
  }

  /**
   * Deletes a user if the viewer has access
   */
  static async delete(viewer: Viewer, id: UUID): Promise<void> {
    // viewer can only delete their own user
    if (!canEditUser(viewer, { id })) {
      throw new Forbidden(`Cannot delete user accounts other than your own.`)
    }

    await getCustomRepository(UserRepository).delete(id)
  }

  /**
   * Authenticates an email and password and returns a token
   */
  static async authenticate(attrs: { email: string; password: string }): Promise<{ token: string }> {
    const user = await getCustomRepository(UserRepository).findByEmail(attrs.email)
    if (!user) {
      throw new NotFound(`No user found with email address: "${attrs.email}"`)
    }

    const isMatch = await comparePassword(attrs.password, user.password)
    if (!isMatch) {
      throw new Unauthorized(`We didn't recognize that combination of email and password.`)
    }

    const token = generateJwt({ sub: user.id })
    return { token }
  }
}
