import { getCustomRepository, getRepository } from 'typeorm'
import { ListRepository } from '../models/list'
import { User } from '../models/user'

const resolvers = {
  Query: {
    async me(_root, _args, { viewer }): Promise<User | null> {
      return (await getRepository(User).findOne({ id: viewer })) || null
    },
    list() {
      return null
    },
    lists(_root, _args, ctx) {
      const repo = getCustomRepository(ListRepository)
      return repo.allByAuthor(ctx.viewer.id)
    },
    task() {
      return null
    },
    tasks() {
      return null
    }
  }
}

export default resolvers
