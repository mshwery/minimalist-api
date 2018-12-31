import { Conflict, Forbidden } from 'http-errors'
import { getCustomRepository } from 'typeorm'
import { Viewer } from '../../types'
import User from './user.entity'
import UserRepository from './user.repository'

class UserModel {
  static async fetchByViewer(viewer: Viewer): Promise<User | null> {
    if (!viewer) {
      return null
    }

    const user = await getCustomRepository(UserRepository).findOne({ id: viewer })
    return user || null
  }

  static async fetchByEmail(_viewer: Viewer, email: string): Promise<User | null> {
    const user = await getCustomRepository(UserRepository).findByEmail(email)
    return user || null
  }

  static async create(_viewer: Viewer, attrs: { id?: string; email: string; password: string }): Promise<User> {
    const repo = getCustomRepository(UserRepository)

    if (await repo.findByEmail(attrs.email)) {
      throw new Conflict('A user with this email address already exists.')
    }

    const user = repo.create(attrs)
    return repo.save(user)
  }

  static async delete(viewer: Viewer, id: string): Promise<void> {
    // current viewer can only delete their own user
    if (id !== viewer) {
      throw new Forbidden(`Cannot delete user accounts other than your own.`)
    }

    await getCustomRepository(UserRepository).delete(id)
  }
}

export { User, UserModel, UserRepository }
