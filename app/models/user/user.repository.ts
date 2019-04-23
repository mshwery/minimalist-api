import { EntityRepository, Repository } from 'typeorm'
import User from './user.entity'

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  public async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email })
  }

  public async findOrCreate({ email, googleId }: { email: string, googleId?: string }) {
    let user = await this.findOne({ email, googleId })

    if (user) {
      return user
    }

    user = this.create({ email, googleId })
    return this.save(user)
  }
}
