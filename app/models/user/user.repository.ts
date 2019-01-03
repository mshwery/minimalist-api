import { EntityRepository, Repository } from 'typeorm'
import User from './user.entity'

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  public async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email })
  }
}
