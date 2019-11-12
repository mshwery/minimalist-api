import { EntityRepository, Repository } from 'typeorm'
import User from './user.entity'

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  public async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email })
  }

  public async findOrCreate(attrs: Partial<User>): Promise<User> {
    let user = await this.findOne(attrs)

    if (user) {
      return user
    }

    user = this.create(attrs)
    return this.save(user)
  }

  public async findByListId(listId: string): Promise<User[]> {
    const query = this.createQueryBuilder('user')
      .innerJoin('user.lists', 'list')
      .where('list.id = :listId', { listId })

    return query.getMany()
  }
}
