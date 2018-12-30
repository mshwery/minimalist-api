import { EntityRepository, Repository } from 'typeorm'
import { User } from './user.entity'
import { Viewer } from '../../types'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async fetchViewer(viewer: Viewer): Promise<User | null> {
    if (!viewer) {
      return null
    }

    const user = await this.findOne({ id: viewer })
    return user || null
  }
}
